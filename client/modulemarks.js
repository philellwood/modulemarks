
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
    console.log(calculate().needed(70));
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
  };
  
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

Template.result.show = function(){
  return Session.get('scoreShown');
};

Template.result.rendered = function(){
  //Width and height
  var width = 600,
      height = 200;

  var data = [
    calculate().needed(40),
    calculate().needed(50),
    calculate().needed(60),
    calculate().needed(70)
    ];
console.log(calculate());
  var color = d3.scale.category10();

  var svg = d3.select(this.find("svg"))
    .attr("width", width)
    .attr("height", height);

  svg.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("y", function(d, i) { return i * 20; })
    .attr("width", function(d) { return d * 5 + "px"; })
    .attr("height", 20)
    .attr("fill", function(d, i) { return color(i); });

svg.selectAll("text")
    .data(data)
  .enter().append("text")
    .attr("x", function(d) { return d * 5 + "px"; })
    .attr("y", function(d,i) { return i * 20;  })
    .attr("dx", -3) // padding-right
    .attr("dy", ".35em") // vertical-align: middle
    .attr("text-anchor", "end") // text-align: right
    .text(String);
};
function calculate(){
  var allAssessments = Assessments.find({user_id:Meteor.userId()}).fetch();
  var totalScore = 0;
  var totalWorth = 0;
  for (var i = allAssessments.length - 1; i >= 0; i--) {
    var a = allAssessments[i];
    totalWorth += parseFloat(a.worth);
    totalScore += a.score*(a.worth/100);
  };
  return {
    totalScore:totalScore,
    totalWorth:totalWorth,
    needed:function(x){
      var result = (x-totalScore)/((100-totalWorth)/100);
      console.log(result);
      return result;
    }
  };
  
}


