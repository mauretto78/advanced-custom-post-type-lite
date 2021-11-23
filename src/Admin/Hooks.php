<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\MetaBoxFieldModel;
use ACPT_Lite\Includes\DB;
use ACPT_Lite\Utils\WPLinks;

/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/admin
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Hooks
{
    /**
     * Display before main content
     */
    public function beforeMainContent()
    {
        $template = get_option( 'template' );

        echo '<!--========== START ACPT CONTENT ==========-->';
        echo '<div class="acpt-theme-container">';

        switch ( $template ) {
            case 'twentyten':
                echo '<div id="container"><div id="content" role="main">';
                break;
            case 'twentyeleven':
                echo '<div id="primary"><div id="content" role="main" class="twentyeleven">';
                break;
            case 'twentytwelve':
                echo '<div id="primary" class="site-content"><div id="content" role="main" class="twentytwelve">';
                break;
            case 'twentythirteen':
                echo '<div id="primary" class="site-content"><div id="content" role="main" class="entry-content twentythirteen">';
                break;
            case 'twentyfourteen':
                echo '<div id="primary" class="content-area"><div id="content" role="main" class="site-content twentyfourteen"><div class="tfwc">';
                break;
            case 'twentyfifteen':
                echo '<div id="primary" role="main" class="content-area twentyfifteen"><div id="main" class="site-main t15wc">';
                break;
            case 'twentysixteen':
                echo '<div id="primary" class="content-area twentysixteen"><main id="main" class="site-main" role="main">';
                break;
            default:
                echo '<div id="primary" class="content-area"><main id="main" class="site-main" role="main">';
                break;
        }
    }

    /**
     * Display after main content
     */
    public function afterMainContent()
    {
        $template = get_option( 'template' );

        switch ( $template ) {
            case 'twentyten':
            case 'twentyeleven':
            case 'twentytwelve':
            case 'twentythirteen':
            case 'twentyfifteen':
                echo '</div></div>';
                break;
            case 'twentyfourteen':
                echo '</div></div></div>';
                break;
            case 'twentysixteen':
            default:
                echo '</div></main>';
                break;
        }

        echo '</div>';
        echo '<!--========== END ACPT CONTENT ==========-->';
    }

    /**
     * Display breadcrumbs
     *
     * @param array $options
     * @throws \Exception
     */
    public function breadcrumb(array $options = [])
    {
        global $wp_query, $post;

        $delimiter = (isset($options['delimiter'])) ? $options['delimiter'] : "/";
        $cssClasses = (isset($options['css'])) ? $options['css'] : '';
        $styles = '';

        $styles .= (isset($options['textAlign'])) ? 'text-align: '.$options['textAlign'].';' : '';
        $styles .= (isset($options['fontSize'])) ? 'font-size: '.$options['fontSize'].';' : '';
        $styles .= (isset($options['fontWeight'])) ? 'font-weight: '.$options['fontWeight'].';' : '';
        $styles .= (isset($options['borderThickness'])) ? 'border-width: '.$options['borderThickness'].'px;' : '';
        $styles .= (isset($options['borderColor'])) ? 'border-color: '.$options['borderColor'].';' : '';
        $styles .= (isset($options['fontWeight'])) ? 'font-weight: '.$options['fontWeight'].';' : '';
        $styles .= (isset($options['borderRadius'])) ? 'border-radius: '. $this->convertToPixelString($options['borderRadius']).';' : '';
        $styles .= (isset($options['background']) and $options['background'] !== '') ? 'background: '.$options['background'].';' : '';
        $styles .= (isset($options['margin'])) ? 'margin: '. $this->convertToPixelString($options['margin']).';' : '';
        $styles .= (isset($options['padding'])) ? 'padding: '. $this->convertToPixelString($options['padding']).';' : '';

        echo '<div class="acpt-breadcrumb '.$cssClasses.'" style="'.$styles.'">';
        echo '<ul class="acpt-breadcrumb-list">';
        if (!is_home()) {
            echo '<li><a href="';
            echo get_option('home');
            echo '">';
            echo 'Home';
            echo "</a></li>";
            echo "<li class='delimiter'>".$delimiter."</li>";

            if (is_single()) {

                foreach (DB::get(['postType' => $post->post_type]) as $postTypeModel) {
                    echo "<li>";
                    echo "<a href='".get_post_type_archive_link($postTypeModel->getName())."'>";
                    echo $postTypeModel->getPlural();
                    echo '</a>';
                    echo "</li>";
                    echo "<li class='delimiter'>".$delimiter."</li>";
                    echo "<li>";
                    the_title();
                    echo '</li>';
                }
            } elseif (is_archive()){
                foreach (DB::get(['postType' => $post->post_type]) as $postTypeModel) {
                    if (is_post_type_archive($postTypeModel->getName())){
                        echo "<li>";
                        echo $postTypeModel->getPlural();
                        echo "</li><li>";
                    }
                }
            }
        }
        echo '</ul>';
        echo '</div>';
    }

    /**
     * @param $pixels
     *
     * @return string
     */
    private function convertToPixelString($pixels)
    {
        $explodedPixels = explode(',', $pixels);
        unset($explodedPixels[4]);

        return implode('px ', $explodedPixels).'px';
    }

    /**
     * Display thumbnail
     *
     * @param array $dimensions
     */
    public function thumbnail($dimensions = [])
    {
        $width = isset($dimensions['w']) ? ( Strings::contains('%', $dimensions['w']) ? $dimensions['w']  : $dimensions['w']  ) : null;
        $height = isset($dimensions['h']) ? ( Strings::contains('%', $dimensions['h']) ? $dimensions['h']  : $dimensions['h'] ) : null;

        global $post;

        if (has_post_thumbnail($post->ID)) {
            $post_thumbnail_id = get_post_thumbnail_id(get_the_ID());
            $thumbnail_url = wp_get_attachment_url($post_thumbnail_id, 'full');

            if($width and $height){
                echo '<img style="object-fit: cover; width: '.$width.'; height: '.$height.';" src="'.$thumbnail_url.'" alt="'.get_the_title().'" />';
            } else {
                echo '<img style="object-fit: cover; " src="'.$thumbnail_url.'" alt="'.get_the_title().'" />';
            }
        } else {

            $style = '';
            $style .= $width ? 'width: '.$width.';' : '';
            $style .= $height ? 'height: '.$height.';' : '';

            echo '<div class="img-placeholder" style="'.$style.'"><span class="icon iconify" data-icon="bx:bx-image-alt" data-width="48" data-height="48"></span></div>';
        }
    }

    /**
     * Display single content
     *
     * @throws \Exception
     */
    public function singleContent()
    {
        global $post;

        $template = DB::getTemplate($post->post_type, 'single');

        $content = $template->getHtml();
        echo eval("?> $content <?php ");
    }

    /**
     * Archive loop
     *
     * @throws \Exception
     */
    public function archiveLoop()
    {
        global $post;

        $template = DB::getTemplate($post->post_type, 'archive');

        $content = $template->getHtml();
        echo eval("?> $content <?php ");
    }

    /**
     * Create a custom loop
     *
     * @param $args
     * @return \WP_Query
     * @throws \Exception
     */
    public function loop($args)
    {
        // $orderBy
        if(isset($args['sortBy']) and null !== $args['sortBy']){

            $sortBy = $args['sortBy'];

            if($sortBy === 'title'){
                $orderBy = 'title';
            } elseif($sortBy === 'date'){
                $orderBy = 'publish_date';
            } else {
                $field = DB::getMetaField($args['sortBy']);
                $orderBy = (MetaBoxFieldModel::NUMBER_TYPE === $field->getType()) ? 'meta_value_num': 'meta_value';
            }
        } else {
            $orderBy = 'title';
        }

        $postType = $args['postType'];
        $sortOrder = (isset($args['sortOrder'])) ? $args['sortOrder'] : 'ASC';

        $queryArgs = [
            'post_type' => $postType,
            'post_status' => 'publish',
            'posts_per_page' => isset($args['perPage']) ? $args['perPage'] : -1,
            'orderby' => $orderBy,
            'order' => $sortOrder,
        ];

        // meta keys
        if(isset($args['sortBy']) and $args['sortBy'] !== 'title' and $args['sortBy'] !== 'date' ){
            $queryArgs['meta_key'] = $field->getDbName();

            //'NUMERIC', 'BINARY', 'CHAR', 'DATE', 'DATETIME', 'DECIMAL', 'SIGNED', 'TIME', 'UNSIGNED'
            if($field->getType() === MetaBoxFieldModel::NUMBER_TYPE){
                $metaType = 'NUMERIC';
            } elseif($field->getType() === MetaBoxFieldModel::DATE_TYPE){
                $metaType = 'DATE';
            } else {
                $metaType = 'CHAR';
            }

            $queryArgs['meta_type'] = $metaType;
        }

        return new \WP_Query( $queryArgs );
    }

    /**
     * Prev next links
     *
     * @param array $options
     */
    public function prevNextLinks(array $options = [])
    {
        global $wp_query, $post;

        $cssClasses = (isset($options['css'])) ? $options['css'] : '';
        $styles = '';

        $styles .= (isset($options['textAlign'])) ? 'text-align: '.$options['textAlign'].';' : '';
        $styles .= (isset($options['borderThickness'])) ? 'border-width: '.$options['borderThickness'].'px;' : '';
        $styles .= (isset($options['borderColor'])) ? 'border-color: '.$options['borderColor'].';' : '';
        $styles .= (isset($options['borderRadius'])) ? 'border-radius: '. $this->convertToPixelString($options['borderRadius']).';' : '';
        $styles .= (isset($options['color']) and $options['color'] !== '') ? 'color: '.$options['color'].';' : '';
        $styles .= (isset($options['margin'])) ? 'margin: '. $this->convertToPixelString($options['margin']).';' : '';
        $styles .= (isset($options['padding'])) ? 'padding: '. $this->convertToPixelString($options['padding']).';' : '';

        $prev = WPLinks::getPrevLink($post->ID);
        $next = WPLinks::getNextLink($post->ID);

        echo '<div class="acpt-prevNext" style="">';

        if($prev){
            echo '
                <div>
                    <a class="'.$cssClasses.'" style="'.$styles.'" href="'.$prev['link'].'">
                        < '.$prev['title'].'
                    </a>
                </div>';
        }

        if($next){
            echo '
                <div>
                    <a class="'.$cssClasses.'" style="'.$styles.'" href="'.$next['link'].'">
                        '.$next['title'].' >
                    </a>
                </div>';
        }

        echo '</div>';
    }

    /**
     * Taxonomy links
     *
     * @param array $options
     */
    public function taxonomyLinks(array $options = [])
    {
        global $post;

        $links = WPLinks::getTaxonomiesLinks($post->ID, $post->post_type);

        if(!empty($links)){
            $delimiter = (isset($options['delimiter'])) ? $options['delimiter'] : '';
            $cssClasses = (isset($options['css'])) ? $options['css'] : '';
            $styles = '';

            $styles .= (isset($options['fontSize'])) ? 'font-size: '.$options['fontSize'].';' : '';
            $styles .= (isset($options['margin'])) ? 'margin: '. $this->convertToPixelString($options['margin']).';' : '';
            $styles .= (isset($options['padding'])) ? 'padding: '. $this->convertToPixelString($options['padding']).';' : '';

            echo '<span class="'.$cssClasses.'" style="'.$styles.'">';

            foreach ($links as $link){
                echo '<a href="'.$link['link'].'">'.$link['name'].'</a>';

                if($link !== end($links)){
                   echo $delimiter;
                }
            }

            echo '</span>';
        }
    }

    /**
     * Display pagination
     *
     * @param $perPage
     */
    public function pagination($perPage)
    {
        global $wp_query, $post;

        $new_args = array('post_type' => $post->post_type, 'posts_per_page' => -1);
        $new_loop = new \WP_Query($new_args);
        $posts_count = $new_loop->post_count;
        $total_pages = ceil($posts_count / $perPage);

        if ($total_pages > 1) {

            $current_page = max(1, get_query_var('paged'));

            echo '<div class="acpt-pagination">';
            $pagination = paginate_links([
                'base' => get_pagenum_link(1) . '%_%',
                'format' => '/page/%#%',
                'current' => $current_page,
                'total' => $total_pages,
                'prev_text' => '<',
                'next_text' => '>',
                'type' => 'array',
            ]);

            echo '<ul>';
            foreach ($pagination as $item){
                echo '<li>'.$item.'</li>';
            }
            echo '</ul>';
            echo '</div>';
        }
    }
}
