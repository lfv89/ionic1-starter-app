angular.module('ionic-starter-app.factories', ['ionic'])

.factory('MovieFactory', function() {
  return {
    movies: function () {
      return [
        {
          id: 0,
          name: 'Avatar',
          image: '../img/mv-avatar.jpg',
          description:  'A Paraplegic Marine dispatched to the moon Pandora on a unique mission becomes torn between following his orders and protecting the world he feels is his home...'
        },
        {
          id: 1,
          name: 'Harry Potter',
          image: '../img/mv-harry-potter.jpg',
          description: 'Rescued from the outrageous neglect of his aunt and uncle, a young boy with a great destiny proves his worth while attending Hogwarts School of Witchcraft and Wizardry. '
        },
        {
          id: 2,
          name: 'Portal',
          image: '../img/mv-portal.jpg',
          description: 'A young test subject named Chell awakes from a stasis in the Aperture Science Research Facility by a mysterious voice. Asked to perform certain "tests", Chell makes her way through variou'
        },
        {
          id: 3,
          name: 'The Grey',
          image: '../img/mv-the-grey.jpg',
          description: 'After their plane crashes in Alaska, six oil workers are led by a skilled huntsman to survival, but a pack of merciless wolves haunts their every step.'
        },
        {
          id: 4,
          name: 'Thor',
          image: '../img/mv-thor.jpg',
          description: 'The powerful but arrogant god Thor is cast out of Asgard to live amongst humans in Midgard (Earth), where he soon becomes one of their finest defenders.'
          }
        ];
    },

    get: function(index) {
      return this.movies()[index];
    }
  }
})
