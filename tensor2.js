//for (let item of mySet) console.log(item);
var inputname=[]
var outputname=[]
var traininginp=[]
var trainingout=[]
function datasetinputs(dataset)
{return data.map(function extrinp(el){return el.inp});}

function datasetoutputs(dataset)
{return data.map(function extrout(el){return el.outp});}

function mapinput(inputsample)
{inpval=new Array(inputname.length);
//console.log(inputsample);
//console.log(inputname);
for(i=0;i<inputname.length;i++)
{//console.log(inputname[i]+" "+i);
inpval[i]=inputsample.includes(inputname[i])?1:0;
}
return inpval;
		}

function mapoutput(outputsample)
{outval=new Array(outputname.length);
for(i=0;i<outputname.length;i++)
{outval[i]=outputsample.includes(outputname[i])?1:0;}
return outval;
		}
		

function extractinputs()
{var inp_name=new Set();
allinp=datasetinputs(data)
for(i=0;i<allinp.length;i++)
	for(j=0;j<allinp[i].length;j++)
inp_name.add(allinp[i][j]);
inputname=Array.from(inp_name);
return inputname;}

function extractoutputs()
{var out_name=new Set();
allout=datasetoutputs(data)
for(i=0;i<allout.length;i++)
	for(j=0;j<allout[i].length;j++)
out_name.add(allout[i][j]);
outputname=Array.from(out_name);
return outputname}


function adjust(aux,epochs_no,error_max,model,xs,ys){
	model.fit(xs, ys, {epochs: epochs_no,shuffle:true}).then(h => {
		document.getElementById("data").innerHTML="error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		aux=h.history.loss[0];
		console.log("maxerr"+error_max+"acterr "+aux);
        if(h.history.loss[0]>error_max)
			adjust(h.history.loss[0],epochs_no,error_max,model,xs,ys);
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
	model.add(tf.layers.dense({units: inputname.length*2, inputShape: [inputname.length]}));
	//model.add(tf.layers.dense({units: 40}));
	model.add(tf.layers.dense({units: inputname.length}));
	model.add(tf.layers.dense({activation:'sigmoid',units: outputname.length}));
	// Prepare the model for training: Specify the loss and the optimizer.
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.1)});
	console.log()
	datasetin=traininginp
	datasetout=trainingout
	const xs=tf.tensor2d(datasetin,[traininginp.length,inputname.length]);
	const ys=tf.tensor2d(datasetout,[trainingout.length,outputname.length]);
	var error=document.getElementById("error").value;
	var epochs=document.getElementById("epochs").value;
	console.log(error+" "+epochs);
	if(error>=0&&error<=0.7&&	epochs>=1)
		//adjust(0,3000,1,0.03,model);
		adjust(0,epochs,error,model,xs,ys);
	else alert("Wrong settings");
}

function addoptions()
{aux="";
		extractinputs();
		extractoutputs();
		traininginp=datasetinputs().map(mapinput);
		trainingout=datasetoutputs().map(mapoutput);
		//console.log(traininginp);
		//console.log(trainingout);
	for(var i=0;i<inputname.length;i++)
		aux+="<div class=\"row\"><div class=\"col>\">"+inputname[i]+"</div><div class=\"col>\">  <input type=\"checkbox\" id=\"in"+i+"\"/> </div></div>";
$("#options").html(aux);
}

async function predict_out(){
	var inp=[];
	for(var i=0;i<inputname.length;i++)
	{aux=$("#in"+i).prop('checked');	
     inp.push(aux);}
	 inp=inp.map(function binary(x) {if(x)return 1; return 0;});
	 true_inp=inp.filter(function onval(x) {return x==1;});
	 //console.log(true_inp);
	 /*if(true_inp.length==0)
	 {alert("Select an option");
	 return;}*/
	 console.log(inp);
	var mod = await tf.loadModel('localstorage://my-model-1');
	var out1=mod.predict(tf.tensor2d(inp,[1,inputname.length]));
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
	dataout+=outputname[x]+" <div class=\"progress\"><div class=\"progress-bar "+backstat+"\" role=\"progressbar\" style=\"width: "+stat+"%\" aria-valuenow=\"100\" aria-valuemin=\"0\" aria-valuemax=\"100\"></div></div>";
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