
Meteor.subscribe("assessments");
Meteor.startup(function(){
  Session.setDefault('scoreShown',false);
});
Template.list.assessments = function () {
  return Assessments.find();
};

Template.list.events({
  'change .score' : function (e) {
    Assessments.update({_id:this._id},
    { $set:
      {
        score:e.srcElement.value
      }
    });
  },
  'change .worth' : function (e) {
    Assessments.update({_id:this._id},
    { $set:
      {
        worth:e.srcElement.value
      }
    });
  },
  'click #newAssessment' : function(e){
    var noOfAssessments = Assessments.find().count();
    console.log(noOfAssessments);
    Assessments.insert({user_id:Meteor.userId(), assessment_id:noOfAssessments+1,score:"0",worth:"0"});
  },
  'click .removeAssessment' : function(e){
    console.log(this);
    Assessments.remove({_id:this._id});
  },
  'click #scoreNeeded' : function(e){
    Session.set('scoreShown',true);
  }
});

Template.assessment.rendered = function(){
  console.log(this.data);
  //Width and height
  var width = 100,
      height = 100;

  // render
  var color = d3.scale.category20();

  var svg = d3.select(this.find("svg"))
    .attr("width", width)
    .attr("height", height);


  var score = this.data.score;
  var total = this.data.worth;
  var dataset=[
    {startA:angle(0), endA:angle(score)},
    {startA:angle(score), endA:angle(100)}
  ];
  function angle(score){
      return 2*Math.PI*(total/100)*(score/100);
  }

  var arc = d3.svg.arc()
      .innerRadius(10)
      .outerRadius(30)
      .startAngle(function(d){return d.startA}) //converting from degs to radians
      .endAngle(function(d){return d.endA}); //just radians

  var chartContainer = svg.append("g")
      .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");

  chartContainer.selectAll("path")
    .data(dataset)
    .enter()
    .append("path")
      .transition()
      .ease("elastic")
      .duration(750)
      .attrTween("d", arcTween)
      //.attr("d", arc)
      .attr("stroke", "white")
      .attr("stroke-width", 0.5)
      .attr("fill", function(d, i) { return color(i); });

  function arcTween(b) {
      var i = d3.interpolate({value: b.previous}, b);
      return function(t) {
        return arc(i(t));
      };
  }
};

Template.result.grades = function(){
  var worthData = calculateWorth();
  return [
  {grade:70, needed:calculateNeeded(70,worthData.totalScore,worthData.totalWorth)},
  {grade:60, needed:calculateNeeded(60,worthData.totalScore,worthData.totalWorth)},
  {grade:50, needed:calculateNeeded(50,worthData.totalScore,worthData.totalWorth)},
  {grade:40, needed:calculateNeeded(40,worthData.totalScore,worthData.totalWorth)}
  ];
};

function calculateNeeded(grade,score,worth){
  var result = ((grade-score)/((100-worth)/100)).toFixed(2);
  console.log(result);
  return result;
}
function calculateWorth(){
  var allAssessments = Assessments.find({user_id:Meteor.userId()}).fetch();
  console.log(allAssessments);
  var totalScore = 0;
  var totalWorth = 0;
  for (var i = allAssessments.length - 1; i >= 0; i--) {
    var a = allAssessments[i];
    totalWorth += parseFloat(a.worth);
    totalScore += a.score*(a.worth/100);
  }
  return {
    totalScore:totalScore,
    totalWorth:totalWorth
  };
}


