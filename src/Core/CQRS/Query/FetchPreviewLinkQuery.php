<?php

namespace ACPT_Lite\Core\CQRS\Query;

use ACPT_Lite\Constants\BelongsTo;
use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\Validators\ArgumentsArrayValidator;

class FetchPreviewLinkQuery implements QueryInterface
{
    /**
     * @var array<string, mixed>
     */
    private array $data;

    /**
     * @param array<string, mixed> $data
     */
    public function __construct(array $data = [])
    {
        $this->data = $data;
    }

    /**
     * @return string
     */
    public function execute(): string
    {
        $mandatory_keys = [
            'id' => [
                'required' => true,
                'type' => 'string|integer',
            ],
            'type' => [
                'required' => true,
                'type' => 'string',
            ],
            'belongsTo' => [
                'required' => true,
                'type' => 'string',
            ],
            'find' => [
                'required' => true,
                'type' => 'string',
            ]
        ];

        $validator = new ArgumentsArrayValidator();

        if (!$validator->validate($mandatory_keys, $this->data)) {
            throw new \InvalidArgumentException($validator->errorMessage());
        }

        $id = $this->data['id'];
        $type = $this->data['type'];
        $find = $this->data['find'];
        $belongsTo = $this->data['belongsTo'];

        if ($type === 'single') {
            if ($belongsTo === BelongsTo::TERM_ID) {
                $link = get_term_link((int)$id, $find);

                if (is_string($link)) {
                    return $link;
                }
            }

            $link = get_the_permalink((int)$id);

            if ($link === false) {
                return '';
            }

            return $link;
        }

        if ($belongsTo === MetaTypes::CUSTOM_POST_TYPE) {
            if ($find === 'post') {
                $categories = get_the_category($id);
                $archiveLink = !empty($categories) ? get_category_link($categories[0]) : '';
            } else {
                $archiveLink = get_post_type_archive_link($find);
            }

            if ($archiveLink === false) {
                return '';
            }

            return $archiveLink;
        }

        if ($belongsTo === MetaTypes::TAXONOMY) {
            $link = get_term_link((int)$id, $find);

            if (is_string($link)) {
                return $link;
            }
        }

        return '';
    }
}
