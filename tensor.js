var resolution1=24;
var resolution2=60;
//document.getElementById("data").innerHTML="init";
function createpoint(){
	var x1=Math.random()*resolution1;
	var y1=Math.random()*resolution2;
    return {x:x1,y:y1}}
	  
//Math.trunc()

function generate_data(max){
	adjust_points=[];
	adjust_output=[];
	for(var i=0;i<max;i++){
		var point=createpoint();
		adjust_points.push([point.x/resolution1,point.y/resolution2]);
		var val=0;
		if((point.x==10&&point.y>=40)||(point.x>11&&point.x<14)||(point.x==14&&point.y<=30)||(point.x==18&&point.y>10)||(point.x>18&&point.x<21)||(point.x==21&&point.y<=50))
		val = 1;
		adjust_output.push(val);}
		return {inp:adjust_points,out:adjust_output};
	}

//console.log(adjust_points);
//create network/model
const model = tf.sequential();
model.add(tf.layers.dense({units: 2, inputShape: [2]}));
model.add(tf.layers.dense({units: 40}));
//model.add(tf.layers.dense({units: 4}));
model.add(tf.layers.dense({units: 20}));
model.add(tf.layers.dense({units: 15}));
//model.add(tf.layers.dense({units: 4}));
model.add(tf.layers.dense({units: 1}));
// Prepare the model for training: Specify the loss and the optimizer.
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});

function adjust(aux){
	data=generate_data(30);//data set for training
	const xs=tf.tensor2d(data.inp,[30,2]);
	const ys=tf.tensor2d(data.out,[30,1]);
    model.fit(xs, ys, {epochs: 1,shuffle:true}).then(h => {
        console.log(h.history.loss[0]);
		document.getElementById("data").innerHTML=document.getElementById("data").innerHTML+"error:  "+h.history.loss[0]+"  error variation: "+(aux-h.history.loss[0])+"<br>";
		aux=h.history.loss[0];
        if(h.history.loss[0]>0.15)
			adjust(h.history.loss[0]);
		else{
			console.log("finish");
			//const xs1=tf.tensor2d(data.inp,[100,2]);
			//const ys1=tf.tensor2d(data.out,[100,1]);
			model.fit(xs1, ys1, {epochs: 10,shuffle:true}).then(h => {
				console.log(h.history.loss[0]);
				document.getElementById("data").innerHTML=document.getElementById("data").innerHTML+"error:  "+h.history.loss[0]+"  error variation:"+(aux-h.history.loss[0])+"<br>";
				aux=h.history.loss[0];
			});
		}
	});
}
	adjust(0);
	console.log('2');