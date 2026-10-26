<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Includes\ACPT_Lite_Cache;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\Data\Meta;
use ACPT_Lite\Utils\PHP\Objects;

class WPAttachment implements \JsonSerializable
{
    public const CACHE_KEY_PREFIX = "WPAttachment_";
    public const CACHE_TTL = 3600; // 1 hour

    /**
     * @var int|null
     */
    private ?int $id = null;

    /**
     * @var string|null
     */
    private ?string $alt = null;

    /**
     * @var WPAttachment|null
     */
    private ?WPAttachment $thumbnail = null;

    /**
     * @var int|null
     */
    private ?int $thumbnailId = null;

    /**
     * @var string|null
     */
    private ?string $type = null;

    /**
     * @var string|null
     */
    private ?string $caption = null;

    /**
     * @var string|null
     */
    private ?string $description = null;

    /**
     * @var string|null
     */
    private ?string $href = null;

    /**
     * @var string|null
     */
    private ?string $src = null;

    /**
     * @var string|null
     */
    private ?string $title = null;

    /**
     * @var array<string, mixed>
     */
    private array $metadata = [];

    /**
     * @var string|null
     */
    private ?string $path = null;

    /**
     * @var array<string, mixed>
     */
    private array $pathinfo = [];

    /**
     * @param string $url
     * @return WPAttachment
     */
    public static function fromUrl(string $url): WPAttachment
    {
        if (empty($url)) {
            return new self();
        }

        if (self::getFromCache($url) !== null) {
            return self::getFromCache($url);
        }


        $uploadDir = wp_get_upload_dir();
        $relativeUrl = self::toRelativeUploadPath($url, $uploadDir);

        $attachmentId = self::resolveAttachmentId($relativeUrl);

        // Fallback: build a minimal attachment from the URL directly
        if (empty($attachmentId)) {
            $attachment = new self();

            // Check if the file physically exists before giving up
            $filePath = $uploadDir['basedir'] . '/' . $relativeUrl;

            if (!file_exists($filePath)) {
                do_action("acpt/error", new \Exception(sprintf(
                    'WPAttachment::fromUrl() could not resolve "%s" (relativeUrl: "%s", filePath: "%s")',
                    $url,
                    $relativeUrl,
                    $filePath
                )));

                return $attachment;
            }

            $attachment->src = $url;
            $attachment->type = (!empty(wp_check_filetype($url)['type'])) ? wp_check_filetype($url)['type'] : 'image/jpeg';
            $attachment->alt = '';
            $attachment->metadata = [];
            $attachment->pathinfo = pathinfo($url);
            self::saveInCache($attachment, $url);

            return $attachment;
        }

        $post = get_post($attachmentId);

        if (!$post instanceof \WP_Post) {
            return new self();
        }

        $attachment = new self();
        $attachment->hydrateFromPostObject($post);
        self::saveInCache($attachment, $url);

        return $attachment;
    }

    /**
     * Strip the upload base URL (and any query string/fragment) from a media URL,
     * leaving the path relative to the uploads directory, as expected by
     * attachment_url_to_postid() and by the on-disk file_exists() fallback.
     *
     * @param string $url
     * @param array<string>  $uploadDir
     *
     * @return string
     */
    private static function toRelativeUploadPath(string $url, array $uploadDir): string
    {
        $url = strtok($url, '?#') ?: $url;
        $baseUrl = rtrim($uploadDir['baseurl'], '/');

        if (Strings::startsWith($url, $baseUrl.'/')) {
            $relativeUrl = substr($url, strlen($baseUrl) + 1);
        } else {
            // Host doesn't match this site's own upload URL (CDN, offloaded
            // media, image accelerator, scheme mismatch, etc.) - such setups
            // normally preserve the uploads path structure even on a different
            // host, so fall back to matching on the path alone.
            $uploadsPath = (string) wp_parse_url($baseUrl, PHP_URL_PATH);
            $urlPath = (string) wp_parse_url($url, PHP_URL_PATH);

            if ($uploadsPath !== '' && $urlPath !== '' && Strings::contains($uploadsPath, $urlPath)) {
                $relativeUrl = substr($urlPath, strpos($urlPath, $uploadsPath) + strlen($uploadsPath));
            } else {
                $relativeUrl = $url;
            }
        }

        if (Strings::startsWith($relativeUrl, '/')) {
            $relativeUrl = substr($relativeUrl, 1);
        }

        return $relativeUrl;
    }

    /**
     * Resolve a relative upload path to an attachment ID, trying a handful of
     * normalized variants before giving up. attachment_url_to_postid() only
     * matches an exact _wp_attached_file value (plus its own -WIDTHxHEIGHT
     * fallback), so it can miss otherwise-valid attachments whose submitted
     * URL differs from the stored path by a "-scaled" suffix or by URL encoding.
     *
     * @param string $relativeUrl
     *
     * @return int
     */
    private static function resolveAttachmentId(string $relativeUrl): int
    {
        $candidates = [$relativeUrl];

        $decoded = rawurldecode($relativeUrl);

        if ($decoded !== $relativeUrl) {
            $candidates[] = $decoded;
        }

        foreach ([$relativeUrl, $decoded] as $candidate) {
            if (preg_match('/^(.*)-scaled(\.[^.]+)$/i', $candidate, $matches)) {
                // Stored value may be the un-scaled original
                $candidates[] = $matches[1].$matches[2];
            } elseif (preg_match('/^(.*)(\.[^.]+)$/', $candidate, $matches)) {
                // Stored value may be the WordPress-generated "-scaled" version
                $candidates[] = $matches[1].'-scaled'.$matches[2];
            }
        }

        foreach (array_unique($candidates) as $candidate) {
            $attachmentId = attachment_url_to_postid($candidate);

            if (!empty($attachmentId)) {
                return (int)$attachmentId;
            }
        }

        return 0;
    }

    /**
     * @param string|int $id
     * @return WPAttachment
     */
    public static function fromId($id): WPAttachment
    {
        if (empty($id)) {
            return new self();
        }

        if (self::getFromCache($id) !== null) {
            return self::getFromCache($id);
        }

        $post = get_post((int)$id);
        $attachment = new self();

        if (!$post instanceof \WP_Post) {
            return $attachment;
        }

        $attachment->hydrateFromPostObject($post);

        self::saveInCache($attachment, $id);

        return $attachment;
    }

    /**
     * @param string|int $identifier
     * @return bool
     */
    public static function invalidCache($identifier): bool
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return false;
        }

        try {
            $cacheKey = md5(self::CACHE_KEY_PREFIX.$identifier);
            $cachedElement = $cache->getItem($cacheKey);

            if (!$cachedElement->isHit()) {
                return false;
            }

            return $cache->deleteItem($cacheKey);
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);

            return false;
        } catch (\ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);

            return false;
        }
    }

    /**
     * @param string|int $identifier
     * @return WPAttachment|null
     */
    private static function getFromCache($identifier): ?WPAttachment
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return null;
        }

        try {
            $cacheKey = md5(self::CACHE_KEY_PREFIX.$identifier);

            ACPT_Lite_Cache::suppressWarnings();

            try {
                $cachedElement = $cache->getItem($cacheKey);
            } finally {
                ACPT_Lite_Cache::restoreWarnings();
            }

            if (!$cachedElement->isHit()) {
                return null;
            }

            if ($cachedElement->get() instanceof WPAttachment) {
                return $cachedElement->get();
            }

            return null;
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
            return null;
        } catch (\ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);
            return null;
        }
    }

    /**
     * @param WPAttachment $attachment
     * @param string|int $identifier
     */
    private static function saveInCache(WPAttachment $attachment, $identifier): void
    {
        $cache = ACPT_Lite_Plugin::getCache();

        if ($cache === null) {
            return;
        }

        try {
            $cacheKey = md5(self::CACHE_KEY_PREFIX.$identifier);
            ACPT_Lite_Cache::suppressWarnings();

            try {
                $cachedElement = $cache->getItem($cacheKey);
                $tag = md5(WPAttachment::class);
                $cachedElement->addTag($tag)->set($attachment)->expiresAfter(self::CACHE_TTL);
                $cache->save($cachedElement);
            } finally {
                ACPT_Lite_Cache::restoreWarnings();
            }
        } catch (\Exception $exception) {
            do_action("acpt/error", $exception);
        } catch (\ACPT_Lite\Vendor\Psr\Cache\InvalidArgumentException $exception) {
            do_action("acpt/error", $exception);
        }
    }

    /**
     * @param \WP_Post $attachment
     * @return void
     */
    private function hydrateFromPostObject(\WP_Post $attachment): void
    {
        $attachmentId = $attachment->ID;

        if (empty($attachmentId)) {
            return;
        }

        $thumbnailId = get_post_thumbnail_id($attachmentId);
        $metadata = wp_get_attachment_metadata($attachmentId);
        $path = wp_get_original_image_path($attachmentId);
        $this->id = $attachmentId;
        $this->thumbnailId = ($thumbnailId !== false) ? $thumbnailId : null;
        $this->alt = Meta::fetch($attachmentId, MetaTypes::CUSTOM_POST_TYPE, '_wp_attachment_image_alt', true);
        $this->type = $attachment->post_mime_type;
        $this->caption = $attachment->post_excerpt;
        $this->description = $attachment->post_content;
        $this->href = get_permalink($attachmentId) !== false ? get_permalink($attachmentId) : null;
        $this->src = $this->obtainSrc($attachment, $metadata);
        $this->title = $attachment->post_title;
        $this->metadata = ($metadata !== false) ? $metadata : [];
        $this->path = ($path !== false) ? $path : null;
        $this->pathinfo = ($path !== false) ? pathinfo($path) : [];
    }

    /**
     * @param \WP_Post $attachment
     * @param array<string, mixed>|false $metadata
     * @return string
     */
    private function obtainSrc(\WP_Post $attachment, $metadata): string
    {
        if ($metadata === false) {
            return $attachment->guid;
        }

        if (!$this->isImage()) {
            return $attachment->guid;
        }

        if (!isset($metadata['file'])) {
            return $attachment->guid;
        }

        $src = wp_upload_dir()['baseurl'];

        if (!Strings::endsWith($src, '/')) {
            $src .= '/';
        }

        $src .= $metadata['file'];

        return $src;
    }

    /**
     * @return int|null
     */
    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return string|null
     */
    public function getAlt(): ?string
    {
        return $this->alt;
    }

    /**
     * @return string|null
     */
    public function getCaption(): ?string
    {
        return $this->caption;
    }

    /**
     * @return string|null
     */
    public function getDescription(): ?string
    {
        return $this->description;
    }

    /**
     * @return string|null
     */
    public function getHref(): ?string
    {
        return $this->href;
    }

    /**
     * @param string|null $size
     *
     * @return string|null
     */
    public function getSrc(?string $size = null): ?string
    {
        if (
            $size != null &&
            isset($this->getMetadata()['sizes']) &&
            isset($this->getMetadata()['sizes'][$size]) &&
            isset($this->getMetadata()['sizes'][$size]['file'])
        ) {
            $file = $this->getMetadata()['sizes'][$size]['file'];
            $basePathInfo = pathinfo($this->src);

            if (!isset($basePathInfo['dirname'])) {
                return null;
            }

            $src = $basePathInfo['dirname'];

            if (!Strings::endsWith($src, '/')) {
                $src .= '/';
            }

            $src .= $file;

            return $src;
        }

        return $this->src ?? null;
    }

    /**
     * @return array<string, string>
     */
    public function getSizes(): array
    {
        $sizes = [];

        if (empty($this->getMetadata()['sizes'])) {
            return $sizes;
        }

        foreach ($this->getMetadata()['sizes'] as $size => $data) {
            $basePathInfo = pathinfo($this->src);

            if (!isset($basePathInfo['dirname'])) {
                continue;
            }

            $src = $basePathInfo['dirname'];

            if (!Strings::endsWith($src, '/')) {
                $src .= '/';
            }

            $src .= $data['file'];

            $sizes[$size] = $src;
        }

        return $sizes;
    }

    /**
     * @return string|null
     */
    public function getTitle(): ?string
    {
        return $this->title;
    }

    /**
     * @return array<string, mixed>
     */
    public function getMetadata(): array
    {
        return $this->metadata;
    }

    /**
     * @return int|null
     */
    public function getThumbnailId(): ?int
    {
        return $this->thumbnailId;
    }

    /**
     * @return WPAttachment|null
     */
    public function getThumbnail(): ?WPAttachment
    {
        $this->thumbnail = (!empty($this->thumbnailId)) ? WPAttachment::fromId($this->thumbnailId) : null;

        return $this->thumbnail;
    }

    /**
     * @return string|null
     */
    public function getType(): ?string
    {
        return $this->type;
    }

    /**
     * @return string|null
     */
    public function getPath(): ?string
    {
        return $this->path;
    }

    /**
     * @return array<string, mixed>
     */
    public function getPathinfo(): array
    {
        return $this->pathinfo;
    }

    /**
     * @return bool
     */
    public function isAudio(): bool
    {
        if ($this->type === null) {
            return false;
        }

        if (Strings::contains('audio', $this->type)) {
            return true;
        }

        if (empty($this->metadata)) {
            return false;
        }

        if (!isset($this->metadata['mime_type'])) {
            return false;
        }

        $mimeType = $this->metadata['mime_type'];

        return Strings::contains('audio', $mimeType);
    }

    /**
     * @return bool
     */
    public function isSVG(): bool
    {
        if ($this->type === null) {
            return false;
        }

        return $this->type === 'image/svg+xml';
    }

    /**
     * @return bool
     */
    public function isImage(): bool
    {
        if ($this->type === null) {
            return false;
        }

        if (Strings::contains('image', $this->type)) {
            return true;
        }

        if (empty($this->metadata)) {
            return false;
        }

        return isset($this->metadata['image_meta']);
    }

    /**
     * @return bool
     */
    public function isVideo(): bool
    {
        if ($this->type === null) {
            return false;
        }

        if (Strings::contains('video', $this->type)) {
            return true;
        }

        if (empty($this->metadata)) {
            return false;
        }

        if (!isset($this->metadata['mime_type'])) {
            return false;
        }

        $mimeType = $this->metadata['mime_type'];

        return Strings::contains('video', $mimeType);
    }

    /**
     * @return bool
     */
    public function isEmpty(): bool
    {
        return $this->id === null;
    }

    /**
     * @param array<string, mixed> $props
     * @return string
     */
    public function render(array $props = []): string
    {
        if ($this->isEmpty()) {
            return '';
        }

        if ($this->isAudio()) {
            return $this->renderAudio();
        }

        if ($this->isImage()) {
            return $this->renderImg($props);
        }

        if ($this->isVideo()) {
            return $this->renderVideo($props);
        }

        return "<a href='".$this->src."'>".(!empty($this->getTitle()) ? $this->getTitle() : $this->getSrc())."</a>";
    }

    /**
     * @return string
     */
    private function renderAudio(): string
    {
        return "<audio data-id='".$this->id."' controls src='".$this->src."'></audio>";
    }

    /**
     * @param array<string, mixed> $props
     * @return string
     */
    private function renderImg(array $props = []): string
    {
        // Thumbnail size (150 x 150 pixels)
        // Medium size (maximum 300 x 300 pixels)
        // Large size (maximum 1024 x 1024 pixels)
        // Full size (the original size of the uploaded image)

        $w = $props['w'] ?? "100%";
        $h = $props['h'] ?? null;
        $class = $props['class'] ?? null;
        $style = $props['style'] ?? null;
        $size = $props['size'] ?? null;
        $data = $props['data'] ?? [];

        if ($size) {
            return "<img ".$this->dataAttrString($data)." data-id='".$this->id."' class='".$class."' style='".$style."' src='".$this->getSrc($size)."' alt='".$this->alt."' title='".$this->title."' width='".$w."' height='".$h."' loading='lazy' decoding='async' />";
        }

        $thumbnail = $this->getSrc('thumbnail');
        $medium = $this->getSrc('medium');
        $large  = $this->getSrc('large');

        $picture = "<picture>";
        $picture .= '<source media="(min-width:1024px)" srcset="'.$this->src.'">';
        $picture .= '<source media="(min-width:321px)" srcset="'.$large.'">';
        $picture .= '<source media="(max-width:320px)" srcset="'.$medium.'">';
        $picture .= "<img ".$this->dataAttrString($data)." data-id='".$this->id."' class='".$class."' style='".$style."' src='".$this->src."' alt='".$this->alt."' title='".$this->title."' width='".$w."' height='".$h."' loading='lazy' decoding='async' />";
        $picture .= "</picture>";

        return $picture;
    }

    /**
     * @param array<string, mixed> $data An associative array where keys represent data attribute names and values represent their corresponding values.
     *
     * @return string A concatenated string of data attributes formatted as HTML attributes.
     */
    private function dataAttrString(array $data = []): string
    {
        $dataAttrString = '';
        foreach ($data as $key => $value) {
            $dataAttrString .= ' data-'.$key.'="'.$value.'"';
        }

        return $dataAttrString;
    }

    /**
     * @param array<string, mixed> $props
     * @return string
     */
    private function renderVideo(array $props = []): string
    {
        $w = $props['w'] ?? "100%";
        $h = $props['h'] ?? null;
        $data = $props['data'] ?? [];
        $type = $props['type'] ?? $this->getType();

        return '<video '.$this->dataAttrString($data).' width="'.$w.'" height="'.$h.'" controls>
                    <source src="'.$this->src.'" type="'.$type.'">
                    Your browser does not support the video tag.
                </video>';
    }

    /**
     * @return \stdClass
     * @throws \ReflectionException
     */
    public function toStdObject(): \stdClass
    {
        $decoded = json_encode($this);

        if ($decoded === false) {
            return new \stdClass();
        }

        $stdObject = json_decode($decoded);

        return Objects::cast(\stdClass::class, $stdObject);
    }

    /**
     * @return int
     */
    public function getFileSize(): int
    {
        if (empty($this->getPath())) {
            return 0;
        }

        return (int)filesize($this->getPath());
    }

    /**
     * @return string
     */
    public function __toString()
    {
        if (!empty($this->getAlt())) {
            return $this->getAlt();
        }

        if (!empty($this->getTitle())) {
            return $this->getTitle();
        }

        if (!empty($this->getDescription())) {
            return $this->getDescription();
        }

        if (!empty($this->getCaption())) {
            return $this->getCaption();
        }

        return $this->getSrc();
    }

    #[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        if ($this->isEmpty()) {
            return [];
        }

        return [
            'id' => $this->id,
            'alt' => !empty($this->alt) ? $this->alt : "",
            'thumbnailId' => $this->thumbnailId,
            'type' => $this->type,
            'caption' => !empty($this->caption) ? $this->caption : "",
            'description' => !empty($this->description) ? $this->description : "",
            'href' => $this->href,
            'src' => $this->src,
            'title' => !empty($this->title) ? $this->title : "",
            'metadata' => $this->metadata,
            'path' => $this->path,
            'pathinfo' => $this->pathinfo,
            'sizes' => $this->getSizes(),
        ];
    }
}
