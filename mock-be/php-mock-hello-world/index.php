<?php
require 'vendor/autoload.php';
use Cumulio\Cumulio;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Access-Control-Allow-Methods: *');
header('Content-Type: application/json');
header("HTTP/1.1 200 OK");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {    
  return 0;    
} 

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$key = 'randomSecretKey';

// Login Logic
if ($_SERVER['REQUEST_URI'] == '/login') {
  $data = json_decode(file_get_contents('php://input'), true);
  $email = $data['email'];
  $password = $data['password'];
  
  $temporaryUsers = array(
    'brad@mars-boots.com' => array(
      'username'=> 'brad',
      'email'=> 'brad@mars-boots.com',
      'brand'=> 'Mars Boots',
      'password'=> 'brad'
    ),
    'angelina@earthly-shoes.com' => array(
      'username'=> 'angelina',
      'email'=> 'angelina@earthly-shoes.com',
      'brand'=> 'Earthly Shoes',
      'password'=> 'angelina'
    )
  );
  if ($temporaryUsers[$email]) {
    $jwt = JWT::encode($temporaryUsers[$email], $key, 'HS256');
    echo json_encode(array(
      'token' => $jwt
    ));
  }
  return;
}


// Key Generation Logic

$token = $_SERVER['HTTP_AUTHORIZATION'];
$token = explode(' ', $token)[1];
$user = (array)JWT::decode($token, new Key($key, 'HS256'));

$client = Cumulio::initialize($_ENV['CUMUL_KEY'], $_ENV['CUMUL_TOKEN'], $_ENV['API_URL']);
$queries = array();

$data = array(
  'integration_id' => $_ENV['INTEGRATION_ID'],
  'type' => 'sso',
  'expiry' => '24 hours',
  'inactivity_interval' => '10 minutes',
  'username' => $user['username'] ?? $_ENV['USER_USERNAME'],
  'name' => $user['username'] ?? $_ENV['USER_NAME'],
  'email' => $user['email'] ?? $_ENV['USER_EMAIL'],
  'suborganization' => $user['username'] ?? $_ENV['USER_SUBORGANIZATION'],
  'role' => 'viewer',
  'metadata' => array(
    'brand' => $user['brand']
  )
);

$authorization = $client->create('authorization', $data);


$authResponse = array(
  'status' => 'success',
  'key' => $authorization['id'],
  'token' => $authorization['token']
);

echo json_encode($authResponse, JSON_PRETTY_PRINT)
?>