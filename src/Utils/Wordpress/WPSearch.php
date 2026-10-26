<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Core\Models\Query\QueryResultModel;

class WPSearch
{
    /**
     * @var string
     */
    private string $postType;

    /**
     * @var array<string, mixed>
     */
    private array $queryFilter = [];

    /**
     * @var int
     */
    private int $page;

    /**
     * @var int
     */
    private int $perPage;

    /**
     * WPSearch constructor.
     *
     * @param string $postType
     * @param array<string, mixed> $queryFilter
     * @param int|null $page
     * @param int|null $perPage
     */
    public function __construct(string $postType, array $queryFilter, ?int $page = null, ?int $perPage = null)
    {
        $this->postType    = $postType;
        $this->queryFilter = $queryFilter;
        $this->page        = $page ?? 1;
        $this->perPage     = $perPage ?? 20;
    }

    /**
     * @return int
     */
    public function totalCount(): int
    {
        $query = new \WP_Query($this->buildQueryArgs(-1));

        return $query->found_posts;
    }

    /**
     * @return array<int, \ACPT_Lite\Core\Models\Query\QueryResultModel>
     * @throws \Exception
     */
    public function results(): array
    {
        $results = [];
        $query = new \WP_Query($this->buildQueryArgs($this->perPage, $this->page));

        foreach ($query->get_posts() as $record) {
            if ($record instanceof \WP_Post) {
                $results[] = QueryResultModel::forPost($record);
            }
        }

        wp_reset_postdata();

        return $results;
    }

    /**
     * @see https://developer.wordpress.org/reference/classes/wp_query/
     * @param int $perPage
     * @param int|null $page
     * @return array<string, mixed>
     */
    private function buildQueryArgs(int $perPage, ?int $page = null): array
    {
        $args = [
            'post_type' => $this->postType,
            'posts_per_page' => $perPage,
        ];

        // params
        if (isset($this->queryFilter['params'])) {
            $args = array_merge($args, $this->queryFilter['params']);
        }

        // date_query
        if (isset($this->queryFilter['date_query'])) {
            $args['date_query'] = [
                $this->queryFilter['date_query']
            ];
        }

        // meta_query
        if (isset($this->queryFilter['meta_query'])) {
            $args['meta_query'] = [];

            if (isset($this->queryFilter['meta_query']['relation'])) {
                $args['meta_query']['relation'] = $this->queryFilter['meta_query']['relation'];
            }

            if (isset($this->queryFilter['meta_query']['elements'])) {
                foreach ($this->queryFilter['meta_query']['elements'] as $q) {
                    $metaQuery = [
                            'key' => $q['key'],
                            'value' => $q['value'],
                    ];

                    if (isset($q['compare'])) {
                        $metaQuery['compare'] = $q['compare'];
                    }

                    if (isset($q['type'])) {
                        $metaQuery['type'] = $q['type'];
                    }

                    $args['meta_query'][] = $metaQuery;
                }
            }
        }

        if ($page !== null) {
            $args['page'] = $page;
        }

        return $args;
    }
}
