<?php

namespace ACPT_Lite\Tests;

use ACPT_Lite\Utils\PhpEval;
use PHPUnit\Framework\TestCase;

class PhpEvalTest extends TestCase
{
    /**
     * @test
     */
    public function can_eval_simple_php_string_code()
    {
        $string = '<?php $node = 333; return $node; ?>';
        $expected = 333;

        $code = PhpEval::evaluate($string);
        $this->assertEquals($expected, $code);
    }
}
