var resolution=30;
//document.getElementById("data").innerHTML="init";
//point = flower (rgb color and petal number)
function createpoint(){
	var r1=Math.random()*255;//rgb color
	var g1=Math.random()*255;
    var b1=Math.random()*255;
	var p1=Math.random()*resolution//number of petals
	return {r:r1,g:g1,b:b1,p:p1}}
	  
//Math.trunc()

function generate_data(max){
	adjust_points=[];
	adjust_output=[];
	for(var i=0;i<max;i++){
		var point=createpoint();
		adjust_points.push([Math.trunc(point.r/100)/3,Math.trunc(point.r/10%10)/10,Math.trunc(point.r%10)/10,Math.trunc(point.g/100)/3,Math.trunc(point.g/10%10)/10,Math.trunc(point.g%10)/10,Math.trunc(point.b/100)/3,Math.trunc(point.b/10%10)/10,Math.trunc(point.b%10)/10,point.p/resolution]);
		//[point.x/resolution1,point.y/resolution2]);
		var val=0;
		if(point.r>200&&point.r<250&&point.g>70&&point.g<100&&point.b>20&&point.b<50&&point.p>5&&point.p<12)//flower color and petal number
		val = [1,0];
		else if(point.r>50&&point.r<100&&point.g>150&&point.g<200&&point.b>180&&point.b<220&&point.p>10&&point.p<16)
		val=[0,1];
		else val=[0,0];
		adjust_output.push(val);}
		//console.log(adjust_points);
		return {inp:adjust_points,out:adjust_output};
	}

//console.log(adjust_points);
//create network/model
const model = tf.sequential();
model.add(tf.layers.dense({units: 10, inputShape: [10]}));
model.add(tf.layers.dense({units: 20}));
model.add(tf.layers.dense({units: 10}));
model.add(tf.layers.dense({units: 2}));
// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

function adjust(aux,dataset_size,epochs_no){
	data=generate_data(dataset_size);//data set for training
	const xs=tf.tensor2d(data.inp,[dataset_size,10]);
	const ys=tf.tensor2d(data.out,[dataset_size,2]);
    model.fit(xs, ys, {epochs: epochs_no,shuffle:true}).then(h => {
        console.log(h.history.loss[0]);
		document.getElementById("data").innerHTML=document.getElementById("data").innerHTML+"error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		aux=h.history.loss[0];
        if(h.history.loss[0]>0.01)
			adjust(h.history.loss[0],dataset_size,epochs_no);
		else{
			console.log("finish");
			model.fit(xs1, ys1, {epochs: epochs_no,shuffle:true}).then(h => {
				console.log(h.history.loss[0]);
				document.getElementById("data").innerHTML=document.getElementById("data").innerHTML+"error:  "+h.history.loss[0]+"  error variation:"+(aux-h.history.loss[0])+"<br>";
				aux=h.history.loss[0];
			});
		}
	});
}
	adjust(0,30,3);
	console.log('2');