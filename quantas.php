<?php
	class InputData 
	{
		public $departure="";
		public $arrival="";
		public $airline="";
		public $class="";
		public $memberlevel="";
		public $date="";
		private $valid=true;
		
		public function fromRequest($str)
		{
			if(isset($_REQUEST[$str])) 
			{
				return $_REQUEST[$str];
			} else 
			{
				$this->valid=false;
				return "";
			}
		}
		
		public function __construct()
		{
			$this->departure=$this->fromRequest("departure");
			$this->arrival=$this->fromRequest("arrival");
			$this->airline=$this->fromRequest("airline");
			$this->class=$this->fromRequest("class");
			$this->memberlevel=$this->fromRequest("memberlevel");
			$this->date=$this->fromRequest("date");
		}
		
		public function is_valid()
		{
			return $this->valid;
		}
		
	}
	
	class QuantasScrape
	{
		private $_data=null;
		
		public function __construct(InputData $data)
		{
			$this->_data=$data;
		}
		
		public function Scrape()
		{
			if(!$this->_data->is_valid()) {
				return null;
			}
			$request="https://services.unique.qantas.com/calculator/v2/segment/".
				$this->_data->departure."/".
				$this->_data->arrival."/".
				$this->_data->airline."/".
				strtolower(str_replace(" ","",$this->_data->class)).
				".json?status_tier=".$this->_data->memberlevel."&date=".
				$this->_data->date;
			//echo $request;
			$response=file_get_contents($request);
			
			$json=json_decode($response);
			
			return $json;
		}
	}
	
	$data=new InputData;
	$scraper=new QuantasScrape($data);
?>
<html>
	<title>
	</title>
	<body>	
<form method="GET">
	<label for="departure">Departure</label>
	<input type="text" name="departure" placeholder="SYD" value="<?=$data->departure?>"><br />
	<label for="arrival">Arrival</label>
	<input type="text" name="arrival" placeholder="LAX" value="<?=$data->arrival?>"><br />
	<label for="airline">Airline</label>
	<input type="text" name="airline" placeholder="QF" value="<?=$data->airline?>"><br />
	<label for="class">Class</label>
	<input type="text" name="class" placeholder="Discount Economy" value="<?=$data->class?>"><br />
	<label for="memberlevel">Member Level</label>
	<input type="text" name="memberlevel" placeholder="Gold" value="<?=$data->memberlevel?>"><br />
	<label for="date">Date</label>
	<input type="text" name="date" placeholder="2015-12-12" value="<?=$data->date?>"><br />
	<input type="submit" value="Go" />
</form>
	
<?php
// request - https://services.unique.qantas.com/calculator/v2/segment/SYD/LAX/QF/discounteconomy.json?status_tier=Gold&date=2015-12-12
	//echo $data->is_valid()?"valid":"not valid";
	
	$json=$scraper->Scrape();
	if($json) {
		if(isset($json->points)) 
		{
			//print_r($json);
			echo "Quantas Points: ".$json->points[0]->base_plus_cabin_bonus."<br />";
			echo "Status Credits: ".$json->points[0]->status_credits."<br />";
		} else 
		{
			echo "Error: ".$json->error;	
		}
	}
?>
</body>
</html>