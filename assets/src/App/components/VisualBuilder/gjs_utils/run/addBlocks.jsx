import {isset} from "../../../../utils/objects";

export const addBlocks = (editor, blocks) => {

    blocks.map((block) => {
        if(isValidBlock(block)) {
            editor.BlockManager.add( block.id, {
                label: `
                    <div>
                        <div class="gjs-block__media">
                            ${block.icon}
                        </div>
                        <div class="gjs-block-label">
                            ${block.label}
                        </div>
                    </div> 
                `,
                category: block.category,
                content: block.content
            } );
        }
    });
};

/**
 *
 * @param block
 * @return {boolean}
 */
const isValidBlock = (block) => {

    if(!isset(block, "id")){
        return false;
    }

    if(!isset(block, "category")){
        return false;
    }

    if(!isset(block, "content")){
        return false;
    }

    if(!isset(block, "label")){
        return false;
    }

    if(!isset(block, "icon")){
        return false;
    }

    return true;
};
