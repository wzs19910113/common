<?php // Common 读档
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

    $output['msg'] = '';

    $conn = new mysqli($config['hostname'], $config['username'], $config['password'], $config['database']);
    if($conn->connect_error){
        $output['msg'] = '数据库连接错误';
    }
    else{
        $result = $conn->query('SELECT * FROM common WHERE id=1');
        if($result->num_rows>0){
            while($row = $result->fetch_assoc()){
                $data = $row;
            }
            // 输出结果
            $output['code'] = 0;
            $output['data'] = $data;
        }
        else{
            $output['code'] = 1;
            $output['msg'] = '找不到存档';
        }
    }
    $conn->close();
    echo json_encode($output);
?>
