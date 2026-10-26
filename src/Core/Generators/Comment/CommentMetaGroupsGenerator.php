<?php

namespace ACPT_Lite\Core\Generators\Comment;

use ACPT_Lite\Constants\MetaTypes;
use ACPT_Lite\Core\CQRS\Command\SaveCommentMetaCommand;
use ACPT_Lite\Core\Generators\AbstractGenerator;
use ACPT_Lite\Core\Repository\MetaRepository;
use ACPT_Lite\Includes\ACPT_Lite_Plugin;

class CommentMetaGroupsGenerator extends AbstractGenerator
{
    /**
     * Generate meta boxes related to comments
     *
     * @return void
     */
    public function generate(): void
    {
        try {
            $metaGroups = MetaRepository::get([
                'belongsTo' => MetaTypes::COMMENT,
                'clonedFields' => true
            ]);

            if (!empty($metaGroups)) {
                add_action('comment_post', function ($commentId) use ($metaGroups) {
                    $command = new SaveCommentMetaCommand($commentId, ACPT_Lite_Plugin::getRequest(), $metaGroups);
                    $command->execute();
                });

                add_action('edit_comment', function ($commentId) use ($metaGroups) {
                    $command = new SaveCommentMetaCommand($commentId, ACPT_Lite_Plugin::getRequest(), $metaGroups);
                    $command->execute();
                });

                foreach ($metaGroups as $metaGroup) {
                    $generator = new CommentMetaGroupGenerator($metaGroup);
                    $generator->generateBackEndForm();
                    $generator->generateFrontEndForm();
                }
            }
        } catch (\Exception $exception) {
            // do nothing
            do_action("acpt/error", $exception);
        }
    }
}
