Modules = new Meteor.Collection('modules');
//{module_id:1, module_name:'optional', assessments:[]}
Assessments = new Meteor.Collection('assessments');
//{assessment_id:1, score:100, worth:100}

if (Meteor.isClient) {
  
  Template.calculate.assessments = function () {
    return Assessments.find({},{sort:{assessment_id:1}});
  };

  Template.calculate.events({
    'change input' : function (e) {
      Assessments.update({_id:Assessments.findOne({assessment_id:this.assessment_id})._id},
      { $set:
        {
          score:e.srcElement.value
        }
      });
    },
    'click #newAssessment' : function(e){
        var noOfAssessments = Assessments.find().count();
        Assessments.insert({assessment_id:noOfAssessments+1,score:0,worth:0});
    },
    'click .removeAssessment' : function(e){
        Assessments.remove({_id:Assessments.findOne({assessment_id:this.assessment_id})._id},1);
    }
  });

  Template.calculate.assessValue = function(){
    return this.score * (this.worth/100);
  }

  Template.scorePie.rendered = function(){
    var score = 50;
    var total = 50;
    
    var dataset=[
      {startA:angle(0), endA:angle(score)},
      {startA:angle(score), endA:angle(100)}
    ];
    function angle(score){
        return 2*Math.PI*(total/100)*(score/100);
    };
    
    var self = this;
    self.node = self.find("svg");
    //Width and height
    var width = 100,
        height = 100;

    // render
    var color = d3.scale.category10();

    var vis = d3.select(".pie").append("svg:svg")
      .attr("width", width)
      .attr("height", height);
    
    
    var arc = d3.svg.arc()
        .innerRadius(10)
        .outerRadius(30)
        .startAngle(function(d){return d.startA}) //converting from degs to radians
        .endAngle(function(d){return d.endA}); //just radians
    
    vis.append("path")
        .data(dataset)
        .attr("d", arc)
        .attr("fill", function(d, i) { return color(i); })
        .attr("transform", "translate(" + (width/2) + "," + (height/2) + ")");
   

  }
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
