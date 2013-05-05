Meteor.publish("assessments", function(){
  Assessments.find();
});