var resolution=30;


function createpoint(){
	var r1=Math.random()*255;//rgb color
	var g1=Math.random()*255;
    var b1=Math.random()*255;
	var p1=Math.random()*resolution//number of petals
	return {r:r1,g:g1,b:b1,p:p1}}
	  

function generate_data(max,x,y,z){ //x,y,z -> proportion for each category
	adjust_points=[];
	adjust_output=[];
	actual_val=[];
	for(var i=0;i<max*x;i++){
		var point=createpoint();
		adjust_points.push([Math.trunc(point.r/100)/3,Math.trunc(point.r/10%10)/10,Math.trunc(point.r%10)/10,Math.trunc(point.g/100)/3,Math.trunc(point.g/10%10)/10,Math.trunc(point.g%10)/10,Math.trunc(point.b/100)/3,Math.trunc(point.b/10%10)/10,Math.trunc(point.b%10)/10,point.p/resolution]);
		actual_val.push(point);
		//[point.x/resolution1,point.y/resolution2]);
		var val=0;
		if(point.r>80&&point.r<150&&point.g>70&&point.g<100&&point.b>20&&point.b<50&&point.p>5&&point.p<12)//flower color and petal number
		{val = [1,0];
		//console.log(val);
		}
		else if(point.r>50&&point.r<100&&point.g>150&&point.g<200&&point.b>180&&point.b<220&&point.p>10&&point.p<16)
		{val=[0,1];
		//console.log(val);
		}
		else val=[0,0];
		adjust_output.push(val);}
	for(var i=0;i<max*y;i++){
		var point={r:Math.random()*70+80,g:Math.random()*30+70,b:Math.random()*30+20,p:Math.random()*7+5};
		adjust_points.push([Math.trunc(point.r/100)/3,Math.trunc(point.r/10%10)/10,Math.trunc(point.r%10)/10,Math.trunc(point.g/100)/3,Math.trunc(point.g/10%10)/10,Math.trunc(point.g%10)/10,Math.trunc(point.b/100)/3,Math.trunc(point.b/10%10)/10,Math.trunc(point.b%10)/10,point.p/resolution]);
		actual_val.push(point);
		adjust_output.push([1,0]);
	}
	for(var i=0;i<max*z;i++){
		var point={r:Math.random()*50+50,g:Math.random()*50+150,b:Math.random()*40+180,p:Math.random()*6+10};
		adjust_points.push([Math.trunc(point.r/100)/3,Math.trunc(point.r/10%10)/10,Math.trunc(point.r%10)/10,Math.trunc(point.g/100)/3,Math.trunc(point.g/10%10)/10,Math.trunc(point.g%10)/10,Math.trunc(point.b/100)/3,Math.trunc(point.b/10%10)/10,Math.trunc(point.b%10)/10,point.p/resolution]);
		actual_val.push(point);
		adjust_output.push([0,1]);
	}
		return {inp:adjust_points,out:adjust_output,points:actual_val};
	}


function showcases(no,model){
	//console.log("showcases");
	var data=generate_data(no,1/3,1/3,1/3);
	//console.log(data);
	var inputs=data.inp;
	var outputs=data.out;
	var po=data.points;
	for(var i=0;i<no;i++){
		console.log(po[i]);
		console.log(outputs[i]);
		var output = model.predict(tf.tensor2d(inputs[i],[1,10]));
		//console.log(model.predict(tf.tensor2d(inputs[i],[1,10])));
		console.log(output.dataSync());
	}
}

async function finishtraining(model){
	//console.log("finish");
	alert("finished training");
	showcases(12,model);
	//console.log("showedcases");
	//console.log("saving model");
	var savedmod=await model.save('localstorage://my-model-1');
	//console.log(savedmod);
	//var mod = await tf.loadModel('localstorage://my-model-1');
	//var out1=mod.predict(tf.tensor2d(converttoinput({r:120,g:80,b:210,p:10}),[1,10]));
	//console.log(out1.dataSync());
}



function converttoinput(point){
	return [Math.trunc(point.r/100)/3,Math.trunc(point.r/10%10)/10,Math.trunc(point.r%10)/10,
			Math.trunc(point.g/100)/3,Math.trunc(point.g/10%10)/10,Math.trunc(point.g%10)/10,
			Math.trunc(point.b/100)/3,Math.trunc(point.b/10%10)/10,Math.trunc(point.b%10)/10,
			point.p/resolution]
}


async function ldmodel(model){
	var model1 = await tf.loadModel('localstorage://my-model-1');
	//console.log("model loaded");
	model1.predict(tf.tensor2d(converttoinput({r:75,g:175,b:200,p:13}),[1,10])).print();
	//console.log("predict");
}

function adjust(aux,dataset_size,epochs_no,error_max,model){
	data=generate_data(dataset_size,30/100,35/100,35/100);//data set for training
	//console.log(data);
	const xs=tf.tensor2d(data.inp,[data.inp.length,10]);
	//console.log(dataset_size+" "+epochs_no+" "+error_max);
	const ys=tf.tensor2d(data.out,[data.out.length,2]);
	model.fit(xs, ys, {epochs: epochs_no,shuffle:true}).then(h => {
        //console.log(h.history.loss[0]);
		document.getElementById("data").innerHTML=/*document.getElementById("data").innerHTML+*/"error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		aux=h.history.loss[0];
		//console.log("maxerr"+error_max);
        if(h.history.loss[0]>error_max)
			adjust(h.history.loss[0],dataset_size,epochs_no,error_max,model);
		else{ finishtraining(model);			
		}
	});
}

function train(){
	const model = tf.sequential();
	model.add(tf.layers.dense({units: 10, inputShape: [10]}));
	model.add(tf.layers.dense({units: 10}));
	model.add(tf.layers.dense({units: 8}));
	model.add(tf.layers.dense({activation:'sigmoid',units: 2}));
	// Prepare the model for training: Specify the loss and the optimizer.
	model.compile({loss: tf.losses.meanSquaredError, optimizer: tf.train.sgd(0.05)});

	var error=document.getElementById("error").value;
	var epochs=document.getElementById("epochs").value;
	var datasetsize=document.getElementById("datasetsize").value;
	//console.log(error+" "+epochs+" "+datasetsize);
	if(error!='undefined'&&	epochs!='undefined'&&datasetsize!='undefined')
		//adjust(0,3000,1,0.03,model);
		adjust(0,datasetsize,epochs,error,model);
	else alert("Wrong settings");
}

async function predict_out(){
	var red=document.getElementById("red").value;
	var green=document.getElementById("green").value;
	var blue=document.getElementById("blue").value;
	var petals=document.getElementById("petals").value;
	if(red>0&&red<255&green>0&&green<255&blue>0&&blue<255&petals>0&&petals<resolution){
		var mod = await tf.loadModel('localstorage://my-model-1');
		var out1=mod.predict(tf.tensor2d(converttoinput({r:red,g:green,b:blue,p:petals}),[1,10]));
		//console.log(out1.dataSync());
		document.getElementById("out").innerHTML=out1.dataSync();
	}
	else alert("Wrong input data");
}
