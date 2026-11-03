<?php
require_once __DIR__ . '/config/config.php';
header('Location: account.php' . (!empty($_SERVER['QUERY_STRING']) ? '?' . $_SERVER['QUERY_STRING'] : ''));
exit;
