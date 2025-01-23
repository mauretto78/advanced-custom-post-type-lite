<?php

namespace ACPT_Lite\Core\Models\Form;

use ACPT_Lite\Core\Models\Abstracts\AbstractModel;
use ACPT_Lite\Core\ValueObjects\FormSubmissionDatumObject;
use ACPT_Lite\Core\ValueObjects\FormSubmissionErrorObject;
use ACPT_Lite\Utils\PHP\Browser;
use ACPT_Lite\Utils\PHP\IP;
use ACPT_Lite\Utils\Wordpress\Users;

class FormSubmissionModel extends AbstractModel implements \JsonSerializable
{
	/**
	 * @var string
	 */
	private $formId;

	/**
	 * @var string
	 */
	private $action;

	/**
	 * @var string
	 */
	private $callback;

	/**
	 * @var FormSubmissionDatumObject[]
	 */
	private ?array $data = [];

	/**
	 * @var \DateTime
	 */
	private $createdAt;

	/**
	 * @var string|null
	 */
	private ?string $ip = null;

	/**
	 * @var int|null
	 */
	private ?int $uid = null;

	/**
	 * @var \WP_User|null
	 */
	private $user = null;

	/**
	 * @var array|null
	 */
	private ?array $browser = [];

	/**
	 * @var FormSubmissionErrorObject[]
	 */
	private ?array $errors = [];

	/**
	 * FormSubmissionModel constructor.
	 *
	 * @param string $id
	 * @param string $formId
	 * @param string $action
	 * @param string $callback
	 * @param int|null $uid
	 *
	 * @throws \Exception
	 */
	public function __construct(
		string $id,
		string $formId,
		string $action,
		string $callback,
		?int $uid = null
	)
	{
		parent::__construct( $id );
		$this->ip = IP::getClientIP();
		$this->browser = Browser::getBrowser();
		$this->formId = $formId;
		$this->action = $action;
		$this->callback = $callback;
		$this->data = [];
		$this->errors = [];
		$this->createdAt = new \DateTime();

		if($uid !== null and $uid > 0){
			$this->uid = (int)$uid;
			$user = new \WP_User((int)$uid);
			$this->user = Users::getUserLabel($user);
		}
	}

	/**
	 * @return int|null
	 */
	public function getUid(): ?int
	{
		return $this->uid;
	}

	/**
	 * @return string|null
	 */
	public function getUser(): ?string
	{
		return $this->user;
	}

	/**
	 * @param string|null $ip
	 */
	public function setIp( ?string $ip ): void
	{
		$this->ip = $ip;
	}

	/**
	 * @return string|null
	 */
	public function getIp(): ?string
	{
		return $this->ip;
	}

	/**
	 * @param array|null $browser
	 */
	public function setBrowser( ?array $browser ): void
	{
		$this->browser = $browser;
	}

	/**
	 * @return array|null
	 */
	public function getBrowser(): ?array
	{
		return $this->browser;
	}

	/**
	 * @return string
	 */
	public function getFormId(): string
	{
		return $this->formId;
	}

	/**
	 * @return string
	 */
	public function getAction(): string
	{
		return $this->action;
	}

	/**
	 * @return string
	 */
	public function getCallback(): string
	{
		return $this->callback;
	}

	/**
	 * @return \DateTime
	 */
	public function getCreatedAt(): \DateTime
	{
		return $this->createdAt;
	}

	/**
	 * @return FormSubmissionDatumObject[]
	 */
	public function getData(): array
	{
		return $this->data;
	}

	/**
	 * @param FormSubmissionDatumObject $datum
	 */
	public function addDatum(FormSubmissionDatumObject $datum)
	{
		$this->data[] = $datum;
	}

	/**
	 * @param FormSubmissionDatumObject $datum
	 */
	public function removeDatum(FormSubmissionDatumObject $datum)
	{
		$this->data = array_filter($this->getData(), function (FormSubmissionDatumObject $d) use($datum){
			return $d->getName() !== $datum->getName();
		});
	}

	/**
	 * @return FormSubmissionErrorObject[]
	 */
	public function getErrors(): ?array
	{
		return $this->errors;
	}

	/**
	 * @param FormSubmissionErrorObject $error
	 */
	public function addError(FormSubmissionErrorObject $error)
	{
		$this->errors[] = $error;
	}

	/**
	 * @param FormSubmissionErrorObject $error
	 */
	public function removeError(FormSubmissionErrorObject $error)
	{
		$this->data = array_filter($this->getErrors(), function (FormSubmissionErrorObject $e) use($error){
			return $e->getKey() !== $error->getKey();
		});
	}

	#[\ReturnTypeWillChange]
	public function jsonSerialize()
	{
		return [
			'id' => $this->getId(),
			'ip' => $this->getIp(),
			'uid' => $this->getUid(),
			'user' => $this->getUser(),
			'browser' => $this->getBrowser(),
			'formId' => $this->getFormId(),
			'action' => $this->getAction(),
			'callback' => $this->getCallback(),
			'data' => $this->getData(),
			'errors' => $this->getErrors(),
			'createdAt' => $this->getCreatedAt()->format("Y-m-d H:i:s"),
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
			'formId' => [
				'required' => true,
				'type' => 'string',
			],
			'uid' => [
				'required' => false,
				'type' => 'string|integer',
			],
			'action' => [
				'required' => true,
				'type' => 'string',
			],
			'callback' => [
				'required' => true,
				'type' => 'string',
			],
			'errors' => [
				'required' => false,
				'type' => 'array',
			],
		];
	}
}