<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Generators\CustomPostType\CustomPostTypeGenerator;
use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Helper\Uuid;
use ACPT_Lite\Core\Models\CustomPostType\CustomPostTypeModel;
use ACPT_Lite\Core\Repository\CustomPostTypeRepository;
use ACPT_Lite\Utils\PHP\Image;
use ACPT_Lite\Utils\Wordpress\WPAttachment;

class SaveCustomPostTypeCommand implements CommandInterface, LogFormatInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data)
    {
        $this->data = $data;
    }

    /**
     * @return string
     * @throws \Exception
     */
    public function execute(): string
    {
        $data = $this->data;

        // Custom icon image resize
        if (isset($data['icon']) && Strings::isUrl($data['icon'])) {
            $attachment = WPAttachment::fromUrl($data['icon']);

            if ($attachment->isImage()) {
                $data['icon'] = Image::resize($attachment, 20, 20);
            }
        }

        $postTypeModel = CustomPostTypeModel::hydrateFromArray([
            'id' => ($data['id'] ? $data['id'] : Uuid::v4()),
            'name' => @$data['name'],
            'singular' => @$data["singular_label"],
            'plural' => @$data["plural_label"],
            'icon' => @$data["icon"],
            'native' => false,
            'supports' => @$data['supports'],
            'labels' =>  @$data['labels'],
            'settings' =>  @$data['settings'],
        ]);

        CustomPostTypeRepository::save($postTypeModel);

        // generate CPT in WP tables
        $customPostTypeGenerator = new CustomPostTypeGenerator($postTypeModel);
        $customPostTypeGenerator->reRegisterPostType();

        $this->flushPermalinkRules();

        do_action("acpt/custom_post_type/save", $this, $postTypeModel);

        return $postTypeModel->getId();
    }

    /**
     * Reset the permalink structure
     */
    private function flushPermalinkRules(): void
    {
        flush_rewrite_rules();
    }

    /**
     * @inheritDoc
     */
    public function logFormat(): array
    {
        return [
            "class"  => SaveCustomPostTypeCommand::class,
            'data' => $this->data
        ];
    }
}
