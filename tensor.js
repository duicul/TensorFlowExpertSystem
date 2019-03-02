var resolution=30;

function datasetinputs(dataset)
{return dataset.map(function extrinp(el){return el.inp});}

function datasetoutputs(dataset)
{return dataset.map(function extrout(el){return el.outp});}

function adjust(aux,epochs_no,error_max,model){
	datasetin=datasetinputs(data)
	datasetout=datasetoutputs(data)
	const xs=tf.tensor2d(datasetin,[datasetin.length,20]);
	//console.log(dataset_size+" "+epochs_no+" "+error_max);
	const ys=tf.tensor2d(datasetout,[datasetout.length,5]);
	model.fit(xs, ys, {epochs: epochs_no,shuffle:true}).then(h => {
		document.getElementById("data").innerHTML="error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		aux=h.history.loss[0];
		console.log("maxerr"+error_max+"acterr "+aux);
        if(h.history.loss[0]>error_max)
			adjust(h.history.loss[0],epochs_no,error_max,model);
		else{ finishtraining(model);			
		}
	});
}

async function finishtraining(model){
	//console.log("finish");
	alert("finished training");
	var savedmod=await model.save('localstorage://my-model-1');
}

function train(){
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 30, inputShape: [20]}));
	model.add(tf.layers.dense({units: 10}));
	model.add(tf.layers.dense({units: 8}));
	model.add(tf.layers.dense({activation:'sigmoid',units: 5}));
	// Prepare the model for training: Specify the loss and the optimizer.
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.05)});

	var error=document.getElementById("error").value;
	var epochs=document.getElementById("epochs").value;
	console.log(error+" "+epochs);
	if(error>=0&&error<=0.7&&	epochs>=1)
		//adjust(0,3000,1,0.03,model);
		adjust(0,epochs,error,model);
	else alert("Wrong settings");
}

async function predict_out(){
	var inp=[]
	for(var i=1;i<=20;i++)
	{//aux=document.getElementById("inp"+i).checked;
	aux=$("#inp"+i).prop('checked');
	//console.log(i+" "+aux);	
     inp.push(aux);}
	 inp=inp.map(function binary(x) {if(x)return 1; return 0;});
	 console.log(inp);
	var mod = await tf.loadModel('localstorage://my-model-1');
	var out1=mod.predict(tf.tensor2d(inp,[1,20]));
	outpercent=out1.dataSync();
	dataout="";
	for(var x=0;x<outpercent.length;x++)
	{stat=outpercent[x]*100;
		if(stat<=33&&stat>=0)
			backstat="bg-success";
		else if(stat>33&&stat<=66)
			backstat="bg-warning";
		else if(stat>66&&stat<=100)
			backstat="bg-danger";
		else stat="";
	dataout+="Output "+x+"<div class=\"progress\"><div class=\"progress-bar "+backstat+"\" role=\"progressbar\" style=\"width: "+stat+"%\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div>";
	}
	document.getElementById("out").innerHTML=dataout;
}