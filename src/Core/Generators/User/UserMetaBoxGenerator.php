<?php

namespace ACPT_Lite\Core\Generators\User;

use ACPT_Lite\Core\CQRS\Command\SaveUserMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Models\Meta\MetaGroupModel;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;
use ACPT_Lite\Utils\Wordpress\Translator;

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
     * @var int|null
     */
    private ?int $userId = null;

    /**
     * UserMetaBoxGenerator constructor.
     *
     * @param MetaGroupModel[] $metaGroups
     * @param int|null $userId
     */
    public function __construct(array $metaGroups, ?int $userId = null)
    {
        $this->metaGroups = $metaGroups;
        $this->userId = $userId;
    }

    /**
     * Register all the functions here
     *
     * @return void
     */
    public function generate(): void
    {
        add_action('show_user_profile', [$this, 'addMetaBoxes']);
        add_action('edit_user_profile', [$this, 'addMetaBoxes']);
        add_action('personal_options_update', [$this, 'saveData']);
        add_action('edit_user_profile_update', [$this, 'saveData']);
    }

    /**
     * Add custom meta boxes to the User.
     *
     * @param \WP_User $user
     *
     * @return void
     */
    public function addMetaBoxes(\WP_User $user): void
    {
        $this->enqueueScripts('save-user');
        $emptyBoxesCount = 0;

        if ($this->showMetaBox($user)) {
            echo '<h3 id="acpt-user-meta-h3">'.Translator::translate("ACPT fields").'</h3>';
            foreach ($this->metaGroups as $metaGroup) {
                $generator = new UserMetaGroupGenerator($metaGroup, $user);
                $render = $generator->render();

                if (!empty($render)) {
                    echo $render;

                    preg_match_all('/acpt-admin-meta-wrapper/', $render, $fieldMatches);

                    if (!empty($fieldMatches[0])) {
                        $emptyBoxesCount++;
                    }
                }
            }
        }

        if ($emptyBoxesCount === 0) {
            echo '<div>'.Translator::translate('No meta group found.').'</div>';
        }
    }

    /**
     * @param \WP_User $user
     *
     * @return bool
     */
    private function showMetaBox(\WP_User $user): bool
    {
        if ($user->ID === get_current_user_id()) {
            return true;
        }

        return (
            $this->userId === null ||
            (isset($_GET['user_id']) && $_GET['user_id'] == $this->userId)
        );
    }

    /**
     * @param int $userId
     *
     * @throws \Exception
     *
     * @return void
     */
    public function saveData(int $userId): void
    {
        $command = new SaveUserMetaCommand($userId, ACPT_Lite_Plugin::getRequest(), $this->metaGroups);
        $command->execute();
    }
}
