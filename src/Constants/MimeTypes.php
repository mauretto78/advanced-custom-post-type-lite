<?php

namespace ACPT_Lite\Constants;

class MimeTypes
{
	// audio
	const ALL = 'All formats';

	// audio
	const AUDIO_MP3 = 'audio/mp3';
	const AUDIO_OGG = 'audio/ogg';
	const AUDIO_WAV = 'audio/wav';

	// image
	const IMAGE_PNG = 'image/png';
	const IMAGE_JPG = 'image/jpg';
	const IMAGE_JPEG = 'image/jpeg';
	const IMAGE_GIF = 'image/gif';
	const IMAGE_WEBP = 'image/webp';
	const IMAGE_HEIC = 'image/heic';
	const IMAGE_HEIF = 'image/heif';
	const IMAGE_SVG = 'image/svg';

	// application
	const APPLICATION_PDF = 'application/pdf';
	const APPLICATION_DOC = 'application/doc';
	const APPLICATION_DOCX = 'application/docx';
	const APPLICATION_XLS = 'application/xls';
	const APPLICATION_XLSX = 'application/xlsx';
	const APPLICATION_KEY = 'application/key';
	const APPLICATION_ODT = 'application/odt';
	const APPLICATION_PPT = 'application/ppt';
	const APPLICATION_PPTX = 'application/pptx';
	const APPLICATION_PPS = 'application/pps';
	const APPLICATION_PPSX = 'application/ppsx';

	//video
	const VIDEO_MP4 = 'video/mp4';
	const VIDEO_M4V = 'video/m4v ';
	const VIDEO_MPG = 'video/mpg';
	const VIDEO_MOV = 'video/mov ';
	const VIDEO_VTT = 'video/vtt ';
	const VIDEO_AVI = 'video/avi';
	const VIDEO_OGV = 'video/ogv ';
	const VIDEO_WMV = 'video/wmv ';
	const VIDEO_3GP = 'video/3gp ';
	const VIDEO_3G2 = 'video/3g2';

	const ALLOWED_VALUES = [
		self::ALL,
		self::AUDIO_MP3,
		self::AUDIO_OGG,
		self::AUDIO_WAV,
		self::IMAGE_PNG,
		self::IMAGE_JPG,
		self::IMAGE_JPEG,
		self::IMAGE_GIF,
		self::IMAGE_WEBP,
		self::IMAGE_HEIC,
		self::IMAGE_HEIF,
		self::IMAGE_SVG,
		self::APPLICATION_PDF,
		self::APPLICATION_DOC,
		self::APPLICATION_DOCX,
		self::APPLICATION_XLS,
		self::APPLICATION_XLSX,
		self::APPLICATION_KEY,
		self::APPLICATION_ODT,
		self::APPLICATION_PPT,
		self::APPLICATION_PPTX,
		self::APPLICATION_PPS,
		self::APPLICATION_PPSX,
		self::VIDEO_MP4,
		self::VIDEO_M4V ,
		self::VIDEO_MPG,
		self::VIDEO_MOV ,
		self::VIDEO_VTT ,
		self::VIDEO_AVI,
		self::VIDEO_OGV ,
		self::VIDEO_WMV ,
		self::VIDEO_3GP ,
		self::VIDEO_3G2,
	];
}