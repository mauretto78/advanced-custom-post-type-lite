<?php

namespace ACPT_Lite\Core\Generators;

use ACPT_Lite\Core\Helper\Strings;
use ACPT_Lite\Core\Models\UserMetaBoxModel;
use ACPT_Lite\Core\Models\UserMetaFieldModel;
use ACPT_Lite\Utils\Sanitizer;

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
     * @var UserMetaBoxModel[] $boxes
     */
    private $boxes;

    /**
     * UserMetaBoxGenerator constructor.
     *
     * @param array $boxes
     */
    public function __construct( array $boxes)
    {
        $this->boxes = $boxes;
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
        foreach ($this->boxes as $boxModel):
            ?>
            <div class="acpt-user-meta-box">
                <h3><?php echo $boxModel->getName(); ?></h3>
                <table class="form-table" id="fieldset-billing">
                    <?php
                    foreach ($boxModel->getFields() as $fieldModel) {
                        $userFieldGenerator = new UserMetaFieldGenerator($fieldModel, $user);
                        $userFieldGenerator->generate();
                    }
                    ?>
                </table>
            </div>
        <?php endforeach;
    }

    /**
     * Save data
     */
    public function saveData($user_id)
    {
        if ( !current_user_can( 'edit_user', $user_id ) ){
            return false;
        }

        foreach ($this->boxes as $boxModel){
            foreach ($boxModel->getFields() as $fieldModel){
                $idName = Strings::toDBFormat($boxModel->getName()) . '_' . Strings::toDBFormat($fieldModel->getName());
                update_user_meta( $user_id, $idName, Sanitizer::sanitizeUserMetaFieldRawData($fieldModel->getType(), $_POST[$idName] ) );

                $extras = [
                        'type',
                        'label',
                ];

                foreach ($extras as $extra){
                    if(isset($_POST[$idName.'_'.$extra])){
                        update_user_meta( $user_id, $idName.'_'.$extra, Sanitizer::sanitizeUserMetaFieldRawData(UserMetaFieldModel::TEXT_TYPE, $_POST[$idName.'_'.$extra] ) );
                    }
                }
            }
        }
    }
}