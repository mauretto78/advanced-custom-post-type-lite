<?php

namespace ACPT_Lite\Utils\Wordpress;

class Files
{
	/**
	 * @param $url
	 * @param null $originalFileName
	 * @param null $parentPostId
	 *
	 * @return array|bool
	 */
	public static function downloadFromUrl($url, $originalFileName = null, $parentPostId = null)
	{
		$fileName = basename($url);
		$wpUploadPath = wp_upload_dir()['path'];
		$filePath = $wpUploadPath . '/' . $fileName;

		if(file_put_contents($filePath, file_get_contents($url))){
			$file = self::uploadFile($filePath, $originalFileName, $parentPostId);

			@unlink($filePath);

			return $file;
		}

		@unlink($filePath);

		return false;
	}

	/**
	 * @param $url
	 *
	 * @return bool
	 */
	public static function deleteFile($url)
	{
		$attachments = get_posts([
			'posts_per_page' => 1,
			'post_type'      => 'attachment',
			'guid'           => $url,
			'fields'         => 'ids',
		]);

		if(empty($attachments)){
			return false;
		}

		foreach ($attachments as $attachmentID){
			$attachmentPath = get_attached_file( $attachmentID);
			$deleteAttachment = wp_delete_attachment($attachmentID, true);
			$deleteFile = @unlink($attachmentPath);
		}

		return true;
	}

	/**
	 * @param $path
	 * @param null $originalFileName
	 * @param null $parentPostId
	 *
	 * @return array|bool
	 */
	public static function uploadFile($path, $originalFileName = null, $parentPostId = null)
	{
		$pathInfo    = pathinfo($path);
		$filename    = ($originalFileName !== null) ? $originalFileName : $pathInfo['basename'];
		$wpUploadDir = wp_upload_dir();
		$fileType    = wp_check_filetype( $filename, null );
		$fileContent = file_get_contents($path);

		$upload =  wp_upload_bits($filename, null, $fileContent);

		if ( ! empty( $upload['error'] ) ) {
			return false;
		}

		$filePath = $upload['file'];

		$postInfo = [
			'guid'           => $wpUploadDir['url'] . '/' . $filename,
			'post_mime_type' => $fileType['type'],
			'post_title'     => $filename,
			'post_content'   => '',
			'post_status'    => 'inherit',
		];

		// Create the attachment.
		$attachId = wp_insert_attachment( $postInfo, $filePath, $parentPostId );

		if (!function_exists('wp_generate_attachment_metadata')){
			require_once(ABSPATH . 'wp-admin/includes/image.php');
			require_once(ABSPATH . 'wp-admin/includes/file.php');
			require_once(ABSPATH . 'wp-admin/includes/media.php');
		}

		// Generate the attachment metadata.
		$attachData = wp_generate_attachment_metadata( $attachId, $filePath );

		// Assign metadata to attachment.
		wp_update_attachment_metadata( $attachId, $attachData );

		$upload['attachmentId'] = $attachId;

		return $upload;
	}
}