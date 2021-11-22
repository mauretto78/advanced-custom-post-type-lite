<?php

namespace ACPT_Lite\Core\Helper;

/**
 * Currencies
 *
 * @since      1.0.0
 * @package    advanced-custom-post-type-lite
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class Currencies
{
    /**
     * @return array
     */
    public static function getList()
    {
        return [
                'USD' => [
                        'name'   => 'United States Dollar',
                        'symbol' => '$',
                ],
                'EUR' => [
                        'name'   => 'Euro Member Countries',
                        'symbol' => '€',
                ],
                'GBP' => [
                        'name'   => 'United Kingdom Pound',
                        'symbol' => '£',
                ],
                'JPY' => [
                        'name'   => 'Japan Yen',
                        'symbol' => '¥',
                ],
                'CAD' => [
                        'name'   => 'Canada Dollar',
                        'symbol' => '$',
                ],
                'AUD' => [
                        'name'   => 'Australia Dollar',
                        'symbol' => '$',
                ],
                'ALL' => [
                        'name'   => 'Albania Lek',
                        'symbol' => 'L',
                ],
                'AFN' => [
                        'name'   => 'Afghanistan Afghani',
                        'symbol' => '؋',
                ],
                'ARS' => [
                        'name'   => 'Argentina Peso',
                        'symbol' => '$',
                ],
                'AWG' => [
                        'name'   => 'Aruba Guilder',
                        'symbol' => 'ƒ',
                ],
                'AZN' => [
                        'name'   => 'Azerbaijan New Manat',
                        'symbol' => '₼',
                ],
                'BSD' => [
                        'name'   => 'Bahamas Dollar',
                        'symbol' => '$',
                ],
                'BBD' => [
                        'name'   => 'Barbados Dollar',
                        'symbol' => '$',
                ],
                'BDT' => [
                        'name'   => 'Bangladeshi taka',
                        'symbol' => '৳',
                ],
                'BYR' => [
                        'name'   => 'Belarus Ruble',
                        'symbol' => 'Br',
                ],
                'BZD' => [
                        'name'   => 'Belize Dollar',
                        'symbol' => 'BZ$',
                ],
                'BMD' => [
                        'name'   => 'Bermuda Dollar',
                        'symbol' => '$',
                ],
                'BOB' => [
                        'name'   => 'Bolivia Boliviano',
                        'symbol' => '$b',
                ],
                'BAM' => [
                        'name'   => 'Bosnia and Herzegovina Convertible Marka',
                        'symbol' => 'KM',
                ],
                'BWP' => [
                        'name'   => 'Botswana Pula',
                        'symbol' => 'P',
                ],
                'BGN' => [
                        'name'   => 'Bulgaria Lev',
                        'symbol' => 'лв',
                ],
                'BRL' => [
                        'name'   => 'Brazil Real',
                        'symbol' => 'R$',
                ],
                'BND' => [
                        'name'   => 'Brunei Darussalam Dollar',
                        'symbol' => '$',
                ],
                'KHR' => [
                        'name'   => 'Cambodia Riel',
                        'symbol' => '៛',
                ],
                'KYD' => [
                        'name'   => 'Cayman Islands Dollar',
                        'symbol' => '$',
                ],
                'CLP' => [
                        'name'   => 'Chile Peso',
                        'symbol' => '$',
                ],
                'CNY' => [
                        'name'   => 'China Yuan Renminbi',
                        'symbol' => '¥',
                ],
                'COP' => [
                        'name'   => 'Colombia Peso',
                        'symbol' => '$',
                ],
                'CRC' => [
                        'name'   => 'Costa Rica Colon',
                        'symbol' => '₡',
                ],
                'HRK' => [
                        'name'   => 'Croatia Kuna',
                        'symbol' => 'kn',
                ],
                'CUP' => [
                        'name'   => 'Cuba Peso',
                        'symbol' => '₱',
                ],
                'CZK' => [
                        'name'   => 'Czech Republic Koruna',
                        'symbol' => 'Kč',
                ],
                'DKK' => [
                        'name'   => 'Denmark Krone',
                        'symbol' => 'kr',
                ],
                'DOP' => [
                        'name'   => 'Dominican Republic Peso',
                        'symbol' => 'RD$',
                ],
                'XCD' => [
                        'name'   => 'East Caribbean Dollar',
                        'symbol' => '$',
                ],
                'EGP' => [
                        'name'   => 'Egypt Pound',
                        'symbol' => '£',
                ],
                'SVC' => [
                        'name'   => 'El Salvador Colon',
                        'symbol' => '$',
                ],
                'EEK' => [
                        'name'   => 'Estonia Kroon',
                        'symbol' => 'kr',
                ],
                'FKP' => [
                        'name'   => 'Falkland Islands (Malvinas) Pound',
                        'symbol' => '£',
                ],
                'FJD' => [
                        'name'   => 'Fiji Dollar',
                        'symbol' => '$',
                ],
                'GHC' => [
                        'name'   => 'Ghana Cedis',
                        'symbol' => '₵',
                ],
                'GIP' => [
                        'name'   => 'Gibraltar Pound',
                        'symbol' => '£',
                ],
                'GTQ' => [
                        'name'   => 'Guatemala Quetzal',
                        'symbol' => 'Q',
                ],
                'GGP' => [
                        'name'   => 'Guernsey Pound',
                        'symbol' => '£',
                ],
                'GYD' => [
                        'name'   => 'Guyana Dollar',
                        'symbol' => '$',
                ],
                'HNL' => [
                        'name'   => 'Honduras Lempira',
                        'symbol' => 'L',
                ],
                'HKD' => [
                        'name'   => 'Hong Kong Dollar',
                        'symbol' => '$',
                ],
                'HUF' => [
                        'name'   => 'Hungary Forint',
                        'symbol' => 'Ft',
                ],
                'ISK' => [
                        'name'   => 'Iceland Krona',
                        'symbol' => 'kr',
                ],
                'INR' => [
                        'name'   => 'India Rupee',
                        'symbol' => '₹',
                ],
                'IDR' => [
                        'name'   => 'Indonesia Rupiah',
                        'symbol' => 'Rp',
                ],
                'IRR' => [
                        'name'   => 'Iran Rial',
                        'symbol' => '﷼',
                ],
                'IMP' => [
                        'name'   => 'Isle of Man Pound',
                        'symbol' => '£',
                ],
                'ILS' => [
                        'name'   => 'Israel Shekel',
                        'symbol' => '₪',
                ],
                'JMD' => [
                        'name'   => 'Jamaica Dollar',
                        'symbol' => 'J$',
                ],
                'JEP' => [
                        'name'   => 'Jersey Pound',
                        'symbol' => '£',
                ],
                'KZT' => [
                        'name'   => 'Kazakhstan Tenge',
                        'symbol' => 'лв',
                ],
                'KPW' => [
                        'name'   => 'Korea (North) Won',
                        'symbol' => '₩',
                ],
                'KRW' => [
                        'name'   => 'Korea (South) Won',
                        'symbol' => '₩',
                ],
                'KGS' => [
                        'name'   => 'Kyrgyzstan Som',
                        'symbol' => 'лв',
                ],
                'LAK' => [
                        'name'   => 'Laos Kip',
                        'symbol' => '₭',
                ],
                'LVL' => [
                        'name'   => 'Latvia Lat',
                        'symbol' => 'Ls',
                ],
                'LBP' => [
                        'name'   => 'Lebanon Pound',
                        'symbol' => '£',
                ],
                'LRD' => [
                        'name'   => 'Liberia Dollar',
                        'symbol' => '$',
                ],
                'LTL' => [
                        'name'   => 'Lithuania Litas',
                        'symbol' => 'Lt',
                ],
                'MKD' => [
                        'name'   => 'Macedonia Denar',
                        'symbol' => 'ден',
                ],
                'MYR' => [
                        'name'   => 'Malaysia Ringgit',
                        'symbol' => 'RM',
                ],
                'MUR' => [
                        'name'   => 'Mauritius Rupee',
                        'symbol' => '₨',
                ],
                'MXN' => [
                        'name'   => 'Mexico Peso',
                        'symbol' => '$',
                ],
                'MNT' => [
                        'name'   => 'Mongolia Tughrik',
                        'symbol' => '₮',
                ],
                'MZN' => [
                        'name'   => 'Mozambique Metical',
                        'symbol' => 'MT',
                ],
                'NAD' => [
                        'name'   => 'Namibia Dollar',
                        'symbol' => '$',
                ],
                'NPR' => [
                        'name'   => 'Nepal Rupee',
                        'symbol' => '₨',
                ],
                'ANG' => [
                        'name'   => 'Netherlands Antilles Guilder',
                        'symbol' => 'ƒ',
                ],
                'NZD' => [
                        'name'   => 'New Zealand Dollar',
                        'symbol' => '$',
                ],
                'NIO' => [
                        'name'   => 'Nicaragua Cordoba',
                        'symbol' => 'C$',
                ],
                'NGN' => [
                        'name'   => 'Nigeria Naira',
                        'symbol' => '₦',
                ],
                'NOK' => [
                        'name'   => 'Norway Krone',
                        'symbol' => 'kr',
                ],
                'OMR' => [
                        'name'   => 'Oman Rial',
                        'symbol' => '﷼',
                ],
                'PKR' => [
                        'name'   => 'Pakistan Rupee',
                        'symbol' => '₨',
                ],
                'PAB' => [
                        'name'   => 'Panama Balboa',
                        'symbol' => 'B/.',
                ],
                'PYG' => [
                        'name'   => 'Paraguay Guarani',
                        'symbol' => 'Gs',
                ],
                'PEN' => [
                        'name'   => 'Peru Nuevo Sol',
                        'symbol' => 'S/.',
                ],
                'PHP' => [
                        'name'   => 'Philippines Peso',
                        'symbol' => '₱',
                ],
                'PLN' => [
                        'name'   => 'Poland Zloty',
                        'symbol' => 'zł',
                ],
                'QAR' => [
                        'name'   => 'Qatar Riyal',
                        'symbol' => '﷼',
                ],
                'RON' => [
                        'name'   => 'Romania New Leu',
                        'symbol' => 'lei',
                ],
                'RUB' => [
                        'name'   => 'Russia Ruble',
                        'symbol' => '₽',
                ],
                'SHP' => [
                        'name'   => 'Saint Helena Pound',
                        'symbol' => '£',
                ],
                'SAR' => [
                        'name'   => 'Saudi Arabia Riyal',
                        'symbol' => '﷼',
                ],
                'RSD' => [
                        'name'   => 'Serbia Dinar',
                        'symbol' => 'Дин.',
                ],
                'SCR' => [
                        'name'   => 'Seychelles Rupee',
                        'symbol' => '₨',
                ],
                'SGD' => [
                        'name'   => 'Singapore Dollar',
                        'symbol' => '$',
                ],
                'SBD' => [
                        'name'   => 'Solomon Islands Dollar',
                        'symbol' => '$',
                ],
                'SOS' => [
                        'name'   => 'Somalia Shilling',
                        'symbol' => 'S',
                ],
                'ZAR' => [
                        'name'   => 'South Africa Rand',
                        'symbol' => 'R',
                ],
                'LKR' => [
                        'name'   => 'Sri Lanka Rupee',
                        'symbol' => '₨',
                ],
                'SEK' => [
                        'name'   => 'Sweden Krona',
                        'symbol' => 'kr',
                ],
                'CHF' => [
                        'name'   => 'Switzerland Franc',
                        'symbol' => 'CHF',
                ],
                'SRD' => [
                        'name'   => 'Suriname Dollar',
                        'symbol' => '$',
                ],
                'SYP' => [
                        'name'   => 'Syria Pound',
                        'symbol' => '£',
                ],
                'TWD' => [
                        'name'   => 'Taiwan New Dollar',
                        'symbol' => 'NT$',
                ],
                'THB' => [
                        'name'   => 'Thailand Baht',
                        'symbol' => '฿',
                ],
                'TTD' => [
                        'name'   => 'Trinidad and Tobago Dollar',
                        'symbol' => 'TT$',
                ],
                'TRY' => [
                        'name'   => 'Turkey Lira',
                        'symbol' => '₺',
                ],
                'TRL' => [
                        'name'   => 'Turkey Lira',
                        'symbol' => '₤',
                ],
                'TVD' => [
                        'name'   => 'Tuvalu Dollar',
                        'symbol' => '$',
                ],
                'UAH' => [
                        'name'   => 'Ukraine Hryvna',
                        'symbol' => '₴',
                ],
                'UGX' => [
                        'name'   => 'Uganda Shilling',
                        'symbol' => 'USh',
                ],
                'UYU' => [
                        'name'   => 'Uruguay Peso',
                        'symbol' => '$U',
                ],
                'UZS' => [
                        'name'   => 'Uzbekistan Som',
                        'symbol' => 'лв',
                ],
                'VEF' => [
                        'name'   => 'Venezuela Bolivar',
                        'symbol' => 'Bs',
                ],
                'VND' => [
                        'name'   => 'Viet Nam Dong',
                        'symbol' => '₫',
                ],
                'YER' => [
                        'name'   => 'Yemen Rial',
                        'symbol' => '﷼',
                ],
                'ZWD' => [
                        'name'   => 'Zimbabwe Dollar',
                        'symbol' => 'Z$',
                ],
        ];
    }
}