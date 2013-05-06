Assessments = new Meteor.Collection('assessments');
//{user_id:xxx, assessment_id:1, score:100, worth:100}
Assessments.allow({
  insert:function(userId, doc){
    return userId===Meteor.userId();
  },
  update:function(userId, doc, fieldNames, modifier){
    return userId===Meteor.userId();
  },
  remove:function(userId, doc){
    return userId===Meteor.userId();
  }
});