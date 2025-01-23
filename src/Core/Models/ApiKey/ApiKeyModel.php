<?php

namespace ACPT_Lite\Core\Models\ApiKey;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use AmeliaBooking\Infrastructure\WP\Integrations\ThriveAutomator\DataFields\Payment\DateTime;

/**
 * ApiKeyModel
 *
 * @since      1.0.5
 * @package    advanced-custom-post-type
 * @subpackage advanced-custom-post-type/core
 * @author     Mauro Cassani <maurocassani1978@gmail.com>
 */
class ApiKeyModel extends AbstractModel implements \JsonSerializable
{
    /**
     * @var int
     */
    private int $uid;

    /**
     * @var string
     */
    private string $key;

    /**
     * @var string
     */
    private string $secret;

    /**
     * @var \DateTime
     */
    private \DateTime $createdAt;

    /**
     * ApiKeyModel constructor.
     *
     * @param           $id
     * @param           $uid
     * @param           $key
     * @param           $secret
     * @param \DateTime $createdAt
     */
    public function __construct(
        string $id,
        int $uid,
	    string $key,
	    string $secret,
        \DateTime $createdAt
    ) {
        parent::__construct($id);
        $this->uid = $uid;
        $this->key = $key;
        $this->secret = $secret;
        $this->createdAt = $createdAt;
    }

    /**
     * @return int
     */
    public function getUid(): int
    {
        return $this->uid;
    }

    /**
     * @return string
     */
    public function getKey(): string
    {
        return $this->key;
    }

    /**
     * @return string
     */
    public function getSecret(): string
    {
        return $this->secret;
    }

    /**
     * @return \DateTime
     */
    public function getCreatedAt(): \DateTime
    {
        return $this->createdAt;
    }

    /**
     * @param \DateTime $createdAt
     */
    public function setCreatedAt( $createdAt )
    {
        $this->createdAt = $createdAt;
    }

	#[\ReturnTypeWillChange]
    public function jsonSerialize()
    {
        return [
            'id' => $this->getId(),
            'uid' => $this->getUid(),
            'key' => $this->getKey(),
            'secret' => '********',
            'createdAt' => $this->getCreatedAt()->format('Y-m-d H:i:s'),
        ];
    }

	/**
	 * @inheritDoc
	 */
	public static function validationRules(): array
	{
		return [
			'id' => [
				'required' => false,
				'type' => 'string',
			],
			'uid' => [
				'required' => true,
				'type' => 'string|integer',
			],
			'key' => [
				'required' => true,
				'type' => 'string',
			],
			'secret' => [
				'required' => true,
				'type' => 'string',
			],
			'createdAt' => [
				'required' => false,
				'type' => 'object',
				'instanceOf' => DateTime::class,
			],
		];
	}
}