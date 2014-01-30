'use strict';

var ContextBrowser = require('../lib/cbd');

module.exports = function (ATOM_CONFIG, InformationObjectService, FullscreenService) {
  return {
    restrict: 'E',
    templateUrl: ATOM_CONFIG.viewsPath + '/partials/context-browser.html',
    scope: {
      resource: '@resource'
    },
    replace: true,
    link: function (scope, element) {
      // This layer will be the closest HTML container of the SVG
      var container = element.find('.svg-container');

      // Do I really need this because I'm isolating scope with @?
      // attr.$observe('resource', function (value) {
      //  console.log(value);
      //});

      var cb = new ContextBrowser(container);

      // Fetch data from the server
      InformationObjectService.getTree(scope.resource)
        .then(function (tree) {
          cb.init(tree);
        }, function (reason) {
          console.error('Error loading tree:', reason);
        });

      // Manage the fullscreen mode
      scope.isFullscreen = false;
      scope.toggleFullscreenMode = function () {
        if (scope.isFullscreen) {
          FullscreenService.cancel();
        } else {
          FullscreenService.enable(element.get(0));
        }
        scope.isFullscreen = !scope.isFullscreen;
      };
      scope.$on('fullscreenchange', function (event, args) {
        if (args.type === 'enter') {
          scope.isFullscreen = true;
        } else {
          scope.isFullscreen = false;
        }
      });

      // Hide relationships
      scope.areRelationshipsHidden = false;
      scope.hideRelationships = function () {
        scope.areRelationshipsHidden = !scope.areRelationshipsHidden;
        if (scope.areRelationshipsHidden) {
          cb.hideRelationships();
        } else {
          cb.showRelationships();
        }
      };
    }
  };
};
