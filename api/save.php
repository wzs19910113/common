<?php // Common 存档
    error_reporting(0);
    header('content-type:application/json;charset=utf-8');
    $config = array
    (
    	//主机名称
    	'hostname' => 'sdm699633126.my3w.com',
    	//用户名
    	'username' => 'sdm699633126',
    	//密码
    	'password' => 'Yulin230902',
    	//数据库名
    	'database' => 'sdm699633126_db',

    	// 用户登录过期时间（小时）
    	'tokenExpire' => 24,
    );

    $output['data'];
    $output['msg'] = '';

    $data = isset($_POST['data'])?$_POST['data']:'';

    $conn = new mysqli($config['hostname'], $config['username'], $config['password'], $config['database']);
    if($conn->connect_error){
        $output['msg'] = '数据库连接错误';
    }
    else{
        if(!isset($data)||$data==''){
            $output['msg'] = '缺少存档数据';
        }
        else{
            $update_time = time();
            $sql = 'UPDATE common SET json=\''.$data.'\',update_time="'.$update_time.'" WHERE id=1';
            $result = $conn->query($sql);
            if($result===TRUE){
                $output['code'] = 0;
                $output['msg'] = '存储成功';
            }
            else{
                $output['msg'] = $sql;
            }
        }
    }
    $conn->close();
    echo json_encode($output);
?>
