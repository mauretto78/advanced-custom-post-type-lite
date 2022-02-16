<?php

namespace ACPT_Lite\Tests;

use ACPT_Lite\Utils\Sluggify;
use PHPUnit\Framework\TestCase;

class SluggifyTest extends TestCase
{
    /**
     * @test
     */
    public function can_sluggify_a_string()
    {
        $string = 'Ciao sono Mauro     ';
        $expected = 'ciao-sono-mauro';

        $this->assertEquals($expected, Sluggify::slug($string));
    }

    /**
     * @test
     */
    public function can_sluggify_a_string_with_custom_max_length()
    {
        $string = 'Ciao sono Mauro     ';
        $expected = 'ci';

        $this->assertEquals($expected, Sluggify::slug($string, 2));
    }
}