<?php

namespace ACPT_Lite\Admin;

use ACPT_Lite\Utils\Wordpress\Translator;

class ACPT_Lite_Admin_Bar_Menu_Item
{
    /**
     * @var string
     */
    public string $id;

    /**
     * @var string
     */
    public string $title;

    /**
     * @var string|null
     */
    public ?string $href = null;

    /**
     * @var array<int, ACPT_Lite_Admin_Bar_Menu_Item>
     */
    public array $children = [];

    /**
     * @param string $id
     * @param string $title
     * @param string|null $href
     */
    public function __construct(string $id, string $title, ?string $href = null)
    {
        $this->id = $this->node($id);
        $this->title = Translator::translate($title);
        $this->href = $this->adminLink($href);
        $this->children = [];
    }

    /**
     * @param ACPT_Lite_Admin_Bar_Menu_Item $child
     * @return void
     */
    public function addChild(ACPT_Lite_Admin_Bar_Menu_Item $child): void
    {
        $this->children[] = $child;
    }

    /**
     * @param string $node
     *
     * @return string
     */
    private function node(string $node): string
    {
        return ACPT_LITE_PLUGIN_NAME . '-' . $node;
    }

    /**
     * @param string|null $page
     *
     * @return string
     */
    private function adminLink(?string $page = null): string
    {
        if ($page === null) {
            return admin_url('admin.php?page='.ACPT_LITE_PLUGIN_NAME);
        }

        return admin_url('admin.php?page='.ACPT_LITE_PLUGIN_NAME.'#/'.$page);
    }
}
