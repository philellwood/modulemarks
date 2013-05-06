Meteor.publish("assessments", function(){
  return Assessments.find({user_id:this.userId});
});