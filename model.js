Assessments = new Meteor.Collection('assessments');
//{user_id:xxx, assessment_id:1, score:100, worth:100}
Assessments.allow({
  insert:function(assessment){
    console.log(assessment);
    return true;
  },
  update:function(assessment){
    console.log(assessment);
    return true;
  }
});