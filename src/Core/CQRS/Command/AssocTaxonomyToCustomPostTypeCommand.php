<?php

namespace ACPT_Lite\Core\CQRS\Command;

use ACPT_Lite\Core\Repository\TaxonomyRepository;

class AssocTaxonomyToCustomPostTypeCommand implements CommandInterface
{
    /**
     * @var string
     */
    private string $postId;

    /**
     * @var string
     */
    private string $taxonomyId;

    /**
     * @var bool
     */
    private bool $checked;

    /**
     * AssocTaxonomyToCustomPostTypeCommand constructor.
     *
     * @param string $postId
     * @param string $taxonomyId
     * @param bool $checked
     */
    public function __construct(string $postId, string $taxonomyId, ?bool $checked = true)
    {
        $this->postId = $postId;
        $this->taxonomyId = $taxonomyId;
        $this->checked = $checked;
    }

    /**
     * @return void
     * @throws \Exception
     */
    public function execute()
    {
        if ($this->checked) {
            TaxonomyRepository::assocToPostType($this->postId, $this->taxonomyId);
        } else {
            TaxonomyRepository::removeAssocPost($this->postId, $this->taxonomyId);
        }
    }
}
