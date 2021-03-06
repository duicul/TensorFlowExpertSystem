var out_name=["Severity","Motherboard","CPU","Video Card","Ram cards","HDD","OS","Drivers","BIOS","Clean Up","PSU"];
var inp_name=["Pc is slow","No image Computer starts no beep","No image Computer starts beeps","No image Computer does not starts","PC wont boot","Bars on screen","Fans speed up","Usb not recognised","Computer keeps restartng","Peripherals aren't working  properly","Commands not working","Internet slow","Computer freezes","PC blue screen of death","Corrupt files or long delays accessing files","Sudden shut off…or sudden anything weird","Unusual noises","Clicking sound"];
var training_steps=[];
var training_variation=[];
function datasetinputs(dataset)
{return dataset.map(function extrinp(el){return el.inp});}

function datasetoutputs(dataset)
{return dataset.map(function extrout(el){return el.outp});}

function adjust(aux,epochs_no,error_max,model,xs,ys,step){
	
	model.fit(xs, ys, {epochs: epochs_no,shuffle:true}).then(h => {
		document.getElementById("data").innerHTML="error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		var vari=aux-h.history.loss[0];
		if(aux!=0)
		{training_variation.push({y:vari});}
		aux=h.history.loss[0];
		console.log("maxerr"+error_max+"acterr "+aux);
		training_steps.push({y:aux});
	
		if(h.history.loss[0]>error_max)
			adjust(h.history.loss[0],epochs_no,error_max,model,xs,ys,step+1);
		else{ finishtraining(model);			
		}
	});
}

async function finishtraining(model){
	//console.log("finish");
	alert("finished training");
	var savedmod=await model.save('localstorage://my-model-1');
	
	var chart = new CanvasJS.Chart("trainingSteps", {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "ErrorOnSteps"
	},
	axisY:{
		includeZero: true
	},
	data: [{        
		type: "line",       
		dataPoints: training_steps
	}]
});
chart.render();

	var chart1 = new CanvasJS.Chart("trainingVariation", {
	animationEnabled: true,
	theme: "light2",
	title:{
		text: "ErrorVariation"
	},
	axisY:{
		includeZero: true
	},
	data: [{        
		type: "line",       
		dataPoints: training_variation
	}]
});
chart1.render();

}

function train(){
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 40, inputShape: [inp_name.length]}));
	//model.add(tf.layers.dense({units: 40}));
	model.add(tf.layers.dense({units: 20}));
	model.add(tf.layers.dense({activation:'sigmoid',units: out_name.length}));
	// Prepare the model for training: Specify the loss and the optimizer.
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.1)});

	var error=document.getElementById("error").value;
	var epochs=document.getElementById("epochs").value;
	console.log(error+" "+epochs);
	if(error>=0&&error<=0.7&&epochs>=1)
	{datasetin=datasetinputs(data)
	datasetout=datasetoutputs(data)
	const xs=tf.tensor2d(datasetin,[datasetin.length,inp_name.length]);
	const ys=tf.tensor2d(datasetout,[datasetout.length,out_name.length]);
	training_steps=[];
	training_variation=[];
	adjust(0,epochs,error,model,xs,ys,0);}
	else alert("Wrong settings");
}

function addoptions()
{aux="<div class=\"row\"><div class=\"col>\">"+inp_name[0]+"</div><div class=\"col>\"> <input type=\"checkbox\" id=\"in"+0+"\"/></div> </div>";
aux+="<div class=\"row\"><form> \
        <div class=\"row\"><div class=\"col\">Image Okay  <input type=\"radio\" name=\"beep\"> </div></div>\
		<div class=\"row\">\
		<div class=\"col\">No image:</div><div class=\"col\">Computer starts </div><div class=\"col\">NoBeeps <input type=\"radio\" name=\"beep\" id=\"in1\"> </div> </div> \
<div class=\"row\"><div class=\"col\"></div><div class=\"col\"></div>             <div class=\"col\">Beeps <input type=\"radio\" name=\"beep\" id=\"in2\"></div></div> \
<div class=\"row\"><div class=\"col\"></div><div class=\"col\">Computer does not start  <input type=\"radio\" name=\"beep\" id=\"in3\"></div><div class=\"col\"></div></div>\
		</form></div>";
	for(var i=4;i<inp_name.length;i++)
		aux+="<div class=\"row\"><div class=\"col>\">"+inp_name[i]+"</div><div class=\"col>\">  <input type=\"checkbox\" id=\"in"+i+"\"/> </div></div>";
$("#options").html(aux);
}

async function predict_out(){
	var inp=[];
	for(var i=0;i<inp_name.length;i++)
	{aux=$("#in"+i).prop('checked');	
     inp.push(aux);}
	 inp=inp.map(function binary(x) {if(x)return 1; return 0;});
	 true_inp=inp.filter(function onval(x) {return x==1;});
	 //console.log(true_inp);
	 if(true_inp.length==0)
	 {alert("Select an option");
	 return;}
	 console.log(inp);
	var mod = await tf.loadModel('localstorage://my-model-1');
	var out1=mod.predict(tf.tensor2d(inp,[1,inp.length]));
	outpercent=out1.dataSync();
	dataout="";
	for(var x=0;x<outpercent.length;x++)
	{stat=outpercent[x]*100;
		if(stat<=40&&stat>=0)
			backstat="bg-success";
		else if(stat>40&&stat<=65)
			backstat="bg-warning";
		else if(stat>65&&stat<=100)
			backstat="bg-danger";
		else stat="";
	if(stat>=25&&x!=0||x==0)
	dataout+=out_name[x]+" <div class=\"progress\"><div class=\"progress-bar "+backstat+"\" role=\"progressbar\" style=\"width: "+stat+"%\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div>";
	}
	document.getElementById("out").innerHTML=dataout;
}

/*function compare(a,b) {
  if (a.last_nom < b.last_nom)
    return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}*/