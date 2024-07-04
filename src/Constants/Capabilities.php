<?php

namespace ACPT_Lite\Constants;

class Capabilities
{
	const MODERATE_COMMENTS = 'moderate_comments';
	const MANAGE_OPTIONS = 'manage_options';
	const MANAGE_CATEGORIES = 'manage_categories';
	const MANAGE_LINKS = 'manage_links';
	const UNFILTERED_HTML = 'unfiltered_html';
	const EDIT_OTHERS_POSTS = 'edit_others_posts';
	const EDIT_PAGES = 'edit_pages';
	const EDIT_OTHERS_PAGES = 'edit_others_pages';
	const EDIT_PUBLISHED_PAGES = 'edit_published_pages';
	const PUBLISH_PAGES = 'publish_pages';
	const DELETE_PAGES = 'delete_pages';
	const DELETE_OTHERS_PAGES = 'delete_others_pages';
	const DELETE_PUBLISHED_PAGES = 'delete_published_pages';
	const DELETE_OTHERS_POSTS = 'delete_others_posts';
	const DELETE_PRIVATE_POSTS = 'delete_private_posts';
	const EDIT_PRIVATE_POSTS = 'edit_private_posts';
	const READ_PRIVATE_POSTS = 'read_private_posts';
	const DELETE_PRIVATE_PAGES = 'delete_private_pages';
	const EDIT_PRIVATE_PAGES = 'edit_private_pages';
	const READ_PRIVATE_PAGES = 'read_private_pages';

	const ALLOWED_VALUES = [
		self::MODERATE_COMMENTS,
		self::MANAGE_OPTIONS,
		self::MANAGE_CATEGORIES,
		self::MANAGE_LINKS,
		self::UNFILTERED_HTML,
		self::EDIT_OTHERS_POSTS,
		self::EDIT_PAGES,
		self::EDIT_OTHERS_PAGES,
		self::EDIT_PUBLISHED_PAGES,
		self::PUBLISH_PAGES,
		self::DELETE_PAGES,
		self::DELETE_OTHERS_PAGES,
		self::DELETE_PUBLISHED_PAGES,
		self::DELETE_OTHERS_POSTS,
		self::DELETE_PRIVATE_POSTS,
		self::EDIT_PRIVATE_POSTS,
		self::READ_PRIVATE_POSTS,
		self::DELETE_PRIVATE_PAGES,
		self::EDIT_PRIVATE_PAGES,
		self::READ_PRIVATE_PAGES,
	];
}