<?php
/*
 * Mjm Chat Extension
 */

/**
 * Description of Mjm Chat
 * @author Mohammad Javad Masoudian (MJM) <2007mjm@gmail.com>
 * @version 1.0
 */

class MjmChat extends CWidget
{
	public $title	= 'Chat room';
	public $rooms 	= array('php'=>'PHP', 'html'=>'HTML');
	public $host 	= 'http://localhost';
	public $port 	= '3000';
	
	public $messagePlaceHolder	= 'Enter your message here...';
	public $sendButtonText		= 'Send';
	
	private $_baseUrl;
	
	public function init()
	{    
		// Get Resource path
		$resources = dirname(__FILE__).DIRECTORY_SEPARATOR.'resources';
    
		// Publish files
		$this->_baseUrl = Yii::app()->assetManager->publish($resources, false, -1, YII_DEBUG);
	}
  
	public function run()
	{
		// Register JS script
		$cs = Yii::app()->clientScript;
		$cs->registerCoreScript('jquery');
		$cs->registerScriptFile($this->host.':'.$this->port.'/socket.io/socket.io.js');
		
		$config = array(
			'host' => $this->host,
			'port' => $this->port,
			'user' => (!Yii::app()->user->isGuest) ? Yii::app()->user->name : null,
		);
		Yii::app()->clientScript->registerScript('mjmChatConfig', 'var mjmChatConfig='.CJavaScript::encode($config).';', CClientScript::POS_HEAD);

		$cs->registerScriptFile($this->_baseUrl.'/javascript/mjmChat.js');
		$cs->registerScriptFile($this->_baseUrl.'/javascript/mjmChatSocket.js');

		// Register CSS file
		$cs->registerCssFile($this->_baseUrl.'/css/mjmChat.css');
		
		// Render view
		$this->render('mjmChatView', array(
			'rooms'=>$this->rooms,
			'title'=>$this->title,
			'messagePlaceHolder'=>$this->messagePlaceHolder,
			'sendButtonText'=>$this->sendButtonText,
		));
	}
}
?>