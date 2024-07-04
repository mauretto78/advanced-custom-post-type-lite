<?php

namespace ACPT_Lite\Utils\Wordpress;

use ACPT_Lite\Core\Models\Query\QueryResultModel;

class WPSearch
{
    /**
     * @var string
     */
    private $postType;

    /**
     * @var array
     */
    private $queryFilter;

    /**
     * @var int
     */
    private $page;

    /**
     * @var int
     */
    private $perPage;

    /**
     * WPSearch constructor.
     *
     * @param string $postType
     * @param array  $q
     * @param string $sort
     * @param string $sortBy
     * @param int    $page
     * @param int    $perPage
     */
    public function __construct( $postType, array $queryFilter, $page = null, $perPage = null )
    {
        $this->postType    = $postType;
        $this->queryFilter = $queryFilter;
        $this->page        = $page ? $page : 1;
        $this->perPage     = $perPage ? $perPage : 20;
    }

    /**
     * @return int
     */
    public function totalCount()
    {
        $query = new \WP_Query( $this->buildQueryArgs(-1) );

        return $query->found_posts;
    }

    /**
     * @return array
     * @throws \Exception
     */
    public function results()
    {
        $results = [];
        $query = new \WP_Query( $this->buildQueryArgs($this->perPage, $this->page) );

        foreach ($query->get_posts() as $record){
            $results[] = new QueryResultModel( $record );
        }

        wp_reset_postdata();

        return $results;
    }

    /**
     * @see https://developer.wordpress.org/reference/classes/wp_query/
     * @param int  $perPage
     * @param null $page
     *
     * @return array
     */
    private function buildQueryArgs($perPage, $page = null)
    {
        $args = [
            'post_type' => $this->postType,
            'posts_per_page' => $perPage,
        ];

        // params
        if(isset($this->queryFilter['params'])){
            $args = array_merge($args, $this->queryFilter['params']);
        }

        // date_query
        if(isset($this->queryFilter['date_query'])){
            $args['date_query'] = [
                $this->queryFilter['date_query']
            ];
        }

        // meta_query
        if(isset($this->queryFilter['meta_query'])){
            $args['meta_query'] = [];

            if(isset($this->queryFilter['meta_query']['relation'])){
                $args['meta_query']['relation'] = $this->queryFilter['meta_query']['relation'];
            }

            if(isset($this->queryFilter['meta_query']['elements'])){
                foreach ($this->queryFilter['meta_query']['elements'] as $q){

                    $metaQuery = [
                            'key' => $q['key'],
                            'value' => $q['value'],
                    ];

                    if(isset($q['compare'])){
                        $metaQuery['compare'] = $q['compare'];
                    }

                    if(isset($q['type'])){
                        $metaQuery['type'] = $q['type'];
                    }

                    $args['meta_query'][] = $metaQuery;
                }
            }
        }

        if($page !== null){
           $args['page'] = $page;
        }

        return $args;
    }
}