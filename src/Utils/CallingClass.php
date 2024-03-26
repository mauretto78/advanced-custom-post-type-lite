<?php

namespace ACPT_Lite\Utils;

class CallingClass
{
	/**
	 * @see https://gist.github.com/hamstar/1122679
	 * @return mixed
	 */
	public static function get() {

		//get the trace
		$trace = debug_backtrace();

		// Get the class that is asking for who awoke it
		$class = $trace[1]['class'];

		// +1 to i cos we have to account for calling this function
		for ( $i=1; $i<count( $trace ); $i++ ) {
			if ( isset( $trace[$i] ) ) {
				if ( $class != $trace[$i]['class'] ) {
					return $trace[$i]['class'];
				}
			}
		}
	}
}