<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Core\CQRS\Command\SaveUserMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Utils\Translator;

/**
 * *************************************************
 * UserMetaBoxGenerator class
 * *************************************************
 *
 * @author Mauro Cassani
 * @link https://github.com/mauretto78/
 */
class UserMetaBoxGenerator extends AbstractGenerator
{
    /**
     * @var MetaGroupModel[] $metaGroups
     */
	private array $metaGroups;

	/**
	 * @var null
	 */
	private $userId = null;

	/**
	 * UserMetaBoxGenerator constructor.
	 *
	 * @param array $metaGroups
	 * @param null $userId
	 */
    public function __construct(array $metaGroups, $userId = null)
    {
        $this->metaGroups = $metaGroups;
        $this->userId = $userId;
    }

    /**
     * Register all the functions here
     */
    public function generate()
    {
        add_action( 'show_user_profile', [$this, 'addMetaBoxes'] );
        add_action( 'edit_user_profile', [$this, 'addMetaBoxes'] );
        add_action( 'personal_options_update', [$this, 'saveData'] );
        add_action( 'edit_user_profile_update', [$this, 'saveData'] );
    }

    /**
     * Add custom meta boxes to the User.
     *
     * @param \WP_User $user
     */
    public function addMetaBoxes(\WP_User $user)
    {
	    $this->enqueueScripts('save-user');

        if(
            $this->userId === null or
            (isset($_GET['user_id']) and $_GET['user_id'] == $this->userId)
        ):

        echo '<h3>'.Translator::translate("ACPT fields").'</h3>';

	    foreach ($this->metaGroups as $metaGroup):
            $generator = new UserMetaGroupGenerator($metaGroup, $user);
		    echo $generator->render();
        endforeach;
        endif;
    }

	/**
	 * Save data
	 * @throws \Exception
	 */
    public function saveData($user_id)
    {
        $command = new SaveUserMetaCommand($user_id, $this->metaGroups);
	    $command->execute();
    }
}