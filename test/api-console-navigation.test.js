import {fixture, assert, html, aTimeout} from '@open-wc/testing';
import {AmfLoader, ApiDescribe} from './amf-loader.js';
import '../api-console.js';
import {navigationDocumentationList,
  navigationDocumentationSection, navigationEndpointsList,
  navigationEndpointsSection, navigationSecurityList, navigationSecuritySection,
  navigationSummarySection, navigationToggleEndpointsSection, navigationTree, navigationTypesList,
  navigationTypesSection
} from './testHelper.js';

/** @typedef {import('..').ApiConsole} ApiConsole */

describe('API Console navigation', () => {
  /**
   * @returns {Promise<ApiConsole>}
   */
  async function amfFixture(amf) {
    return (fixture(html`
        <api-console .amf="${amf}"></api-console>
    `));
  }

  const googleApi = 'google-drive-api';

  [
    new ApiDescribe('Regular model'),
    new ApiDescribe('Compact model', true)
  ].forEach(({label, compact}) => {
    describe(label, () => {
      let element;
      let amf;

      before(async () => {
        amf = await AmfLoader.load({compact, fileName: googleApi});
      });

      beforeEach(async () => {
        element = await amfFixture(amf);
      });

      [
        ['Summary', navigationSummarySection],
        ['Endpoints', navigationEndpointsSection],
        ['Documentation', navigationDocumentationSection],
        ['Types', navigationTypesSection],
        ['Security', navigationSecuritySection],
      ].forEach(([sectionName, getSection]) => {
        it(`should render ${sectionName} section`,  () => {
          const item = getSection(element)
          assert.ok(item);

          const name = sectionName === 'Summary' ? item.innerText: item.querySelector('.section-title').innerText
          assert.equal(name.trim(), sectionName);
        });
      })

      describe('Summary section', () => {
        it(`should not render Summary section when summary property disabled`, async () => {
          navigationTree(element).summary = false;
          await aTimeout(0);

          const summarySection = navigationSummarySection(element);
          assert.notOk(summarySection);
        });

        it(`should render custom label for Summary section`, async () => {
          const summaryLabel = 'My summary label';
          navigationTree(element).summaryLabel = summaryLabel;
          await aTimeout(0);

          const summarySection = navigationSummarySection(element);
          assert.equal(summarySection.innerText.trim(), summaryLabel);
        });
      });

      describe('Endpoints section', () => {
        const testEndpoint = (endpoint, path, name) => {
          assert.equal(endpoint.getAttribute('data-endpoint-path'), path)
          assert.equal(endpoint.querySelector('.endpoint-name').innerText, name)
        }

        const testGoogleEndpoints = (elem, fullPaths = false) => {
          const endpointsList = navigationEndpointsList(elem);
          assert.ok(endpointsList);
          assert.lengthOf(endpointsList, 32);

          [["/files", "Files"],
          ["/files/{fileId}", "Get file"],
          ["/files/{fileId}/copy", fullPaths ? "/files/{fileId}/copy" : "/copy"],
          ["/files/{fileId}/touch", fullPaths ? "/files/{fileId}/touch" : "/touch"],
          ["/files/{fileId}/trash", fullPaths ? "/files/{fileId}/trash" : "/trash"],
          ["/files/{fileId}/untrash", fullPaths ? "/files/{fileId}/untrash" : "/untrash"],
          ["/files/{fileId}/parents", fullPaths ? "/files/{fileId}/parents" : "/parents"],
          ["/files/{fileId}/parents/{parentId}", fullPaths ? "/files/{fileId}/parents/{parentId}" : "/{parentId}"],
          ["/files/{fileId}/permissions", fullPaths ? "/files/{fileId}/permissions" : "/permissions"],
          ["/files/{fileId}/permissions/{permissionId}", fullPaths ? "/files/{fileId}/permissions/{permissionId}" : "/{permissionId}"],
          ["/files/{fileId}/revisions", fullPaths ? "/files/{fileId}/revisions" : "/revisions"],
          ["/files/{fileId}/revisions/{revisionId}", fullPaths ? "/files/{fileId}/revisions/{revisionId}" : "/{revisionId}"],
          ["/files/{fileId}/comments", fullPaths ? "/files/{fileId}/comments" : "/comments"],
          ["/files/{fileId}/comments/{commentId}", fullPaths ? "/files/{fileId}/comments/{commentId}" : "/{commentId}"],
          ["/files/{fileId}/comments/{commentId}/replies", fullPaths ? "/files/{fileId}/comments/{commentId}/replies" : "/replies"],
          ["/files/{fileId}/comments/{commentId}/replies/{replyId}", fullPaths ? "/files/{fileId}/comments/{commentId}/replies/{replyId}" : "/{replyId}"],
          ["/files/{fileId}/realtime", fullPaths ? "/files/{fileId}/realtime" : "/realtime"],
          ["/files/{fileId}/properties", fullPaths ? "/files/{fileId}/properties" : "/properties"],
          ["/files/{fileId}/properties/{propertyKey}", fullPaths ? "/files/{fileId}/properties/{propertyKey}" : "/{propertyKey}"],
          ["/files/trash", fullPaths ? "/files/trash" : "/trash"],
          ["/files/{folderId}/children", fullPaths ? "/files/{folderId}/children" : "/{folderId}/children"],
          ["/files/{folderId}/children/{childId}", fullPaths ? "/files/{folderId}/children/{childId}" : "/{childId}"],
          ["/about", "About"],
          ["/changes", "Changes"],
          ["/changes/{changeId}", fullPaths ? "/changes/{changeId}" : "/{changeId}"],
          ["/changes/watch", fullPaths ? "/changes/watch" : "/watch"],
          ["/permissionIds/{email}", fullPaths ? "/permissionIds/{email}" : "/permissionIds/{email}"],
          ["/apps", "Apps"],
          ["/apps/{appId}", fullPaths ? "/apps/{appId}" : "/{appId}"],
          ["/channels/stop", fullPaths ? "/channels/stop" : "/channels/stop"],
          ["/teamdrives", "Teamdrives"],
          ["/teamdrives/{teamDriveId}", fullPaths ? "/teamdrives/{teamDriveId}" :"/{teamDriveId}"]
            ].forEach((([path, name], index) => testEndpoint(endpointsList[index], path, name)));
        }

        const testSortedGoogleEndpoints = (elem) => {
          const endpointsList = navigationEndpointsList(elem);
          assert.ok(endpointsList);
          assert.lengthOf(endpointsList, 32);

          [["/about", "About"],
          ["/apps", "Apps"],
          ["/apps/{appId}", "/{appId}"],
          ["/changes", "Changes"],
          ["/changes/watch", "/watch"],
          ["/changes/{changeId}", "/{changeId}"],
          ["/channels/stop", "/channels/stop"],
          ["/files", "Files"],
          ["/files/trash", "/trash"],
          ["/files/{fileId}", "Get file"],
          ["/files/{fileId}/comments", "/comments"],
          ["/files/{fileId}/comments/{commentId}", "/{commentId}"],
          ["/files/{fileId}/comments/{commentId}/replies", "/replies"],
          ["/files/{fileId}/comments/{commentId}/replies/{replyId}", "/{replyId}"],
          ["/files/{fileId}/copy", "/copy"],
          ["/files/{fileId}/parents", "/parents"],
          ["/files/{fileId}/parents/{parentId}", "/{parentId}"],
          ["/files/{fileId}/permissions", "/permissions"],
          ["/files/{fileId}/permissions/{permissionId}", "/{permissionId}"],
          ["/files/{fileId}/properties", "/properties"],
          ["/files/{fileId}/properties/{propertyKey}", "/{propertyKey}"],
          ["/files/{fileId}/realtime", "/realtime"],
          ["/files/{fileId}/revisions", "/revisions"],
          ["/files/{fileId}/revisions/{revisionId}", "/{revisionId}"],
          ["/files/{fileId}/touch", "/touch"],
          ["/files/{fileId}/trash", "/trash"],
          ["/files/{fileId}/untrash", "/untrash"],
          ["/files/{folderId}/children", "/{folderId}/children"],
          ["/files/{folderId}/children/{childId}", "/{childId}"],
          ["/permissionIds/{email}", "/permissionIds/{email}"],
          ["/teamdrives", "Teamdrives"],
          ["/teamdrives/{teamDriveId}", "/{teamDriveId}"]
          ].forEach(([path, name], index) => testEndpoint(endpointsList[index], path, name))
        }

        it(`should be expanded by default and list all endpoints`, async () => {
          const endpointsSection = navigationEndpointsSection(element);
          assert.ok(endpointsSection);
          assert.equal(endpointsSection.getAttribute('data-opened'), '');

          testGoogleEndpoints(element)
        })

        it(`should be collapsed when endpointsOpened property set to false`, async () => {
          navigationTree(element).endpointsOpened = false;
          await aTimeout(0);

          const endpointsSection = navigationEndpointsSection(element);
          assert.ok(endpointsSection);
          assert.isNull(endpointsSection.getAttribute('data-opened'));
        })

        it(`should list endpoints alphabetically`, async () => {
          element.rearrangeEndpoints = true
          await aTimeout(0);

          testSortedGoogleEndpoints(element);
        })

        it(`should list endpoints with full paths`, async () => {
          element.renderFullPaths = true
          await aTimeout(0);

          testGoogleEndpoints(element, true);
        })

        it(`should render overview by default`, async () => {
          const endpointsSection = navigationEndpointsSection(element);
          const operations = endpointsSection.querySelector('.operation-collapse');
          const overview = operations.querySelector('[data-shape="endpoint"]')
          assert.ok(overview)
        })

        it(`should not render overview when noOverview property set`, async () => {
          element.noOverview = true
          await aTimeout(0);

          const endpointsSection = navigationEndpointsSection(element);
          const operations = endpointsSection.querySelector('.operation-collapse');
          const overview = operations.querySelector('[data-shape="endpoint"]')
          assert.notOk(overview)
        })

        it(`should expand all operations if operationsOpened is enabled`, async () => {
          element.operationsOpened = true
          await aTimeout(0);

          const endpointsSection = navigationEndpointsList(element);
          endpointsSection.forEach((endpoint) => assert.equal(endpoint.getAttribute('endpoint-opened'), ''))
        })

        describe('Toggle endpoints', () => {
          it(`should be collapsed when endpointsOpened property set to false`, async () => {
            navigationTree(element).endpointsOpened = false;
            await aTimeout(0);

            let endpointsSection = navigationEndpointsSection(element);
            assert.ok(endpointsSection);
            assert.isNull(endpointsSection.getAttribute('data-opened'));

            navigationToggleEndpointsSection(element);
            await aTimeout(0)

            endpointsSection = navigationEndpointsSection(element);
            assert.ok(endpointsSection);
            assert.equal(endpointsSection.getAttribute('data-opened'), '');
          })

          it(`should be expanded by default and should collapse on click`, async () => {
            let endpointsSection = navigationEndpointsSection(element);
            assert.ok(endpointsSection);
            assert.equal(endpointsSection.getAttribute('data-opened'), '');

            navigationToggleEndpointsSection(element);
            await aTimeout(0)

            endpointsSection = navigationEndpointsSection(element);
            assert.ok(endpointsSection);
            assert.isNull(endpointsSection.getAttribute('data-opened'));
          })
        });
      });

      describe('Documentation section', () => {
        it(`should be collapsed by default`, async () => {
          const documentationSection = navigationDocumentationSection(element);
          assert.isNull(documentationSection.getAttribute('data-opened'));
        })

        it(`should be expanded if docsOpened enabled`, async () => {
          navigationTree(element).docsOpened = true;
          await aTimeout(0);

          const documentationSection = navigationDocumentationSection(element);
          assert.equal(documentationSection.getAttribute('data-opened'), '');
        })

        it(`should list all documentation items`, async () => {
          const documentationList = navigationDocumentationList(element);
          assert.ok(documentationList);
          assert.lengthOf(documentationList, 3);

          assert.equal(documentationList[0].innerText.trim(), 'Headline');
          assert.equal(documentationList[1].innerText.trim(), 'Upload files');
          assert.equal(documentationList[2].innerText.trim(), 'Search for file');
        });
      });

      describe('Types section', () => {
        it(`should be collapsed by default`, async () => {
          const typesSection = navigationTypesSection(element);
          assert.isNull(typesSection.getAttribute('data-opened'));
        })

        it(`should be expanded if typesOpened enabled`, async () => {
          navigationTree(element).typesOpened = true;
          await aTimeout(0);

          const typesSection = navigationTypesSection(element);
          assert.equal(typesSection.getAttribute('data-opened'), '');
        })

        it(`should list all type items`, async () => {
          const documentationList = navigationTypesList(element);
          assert.ok(documentationList);
          assert.lengthOf(documentationList, 50);

          ['TeamDrive', 'TeamDriveList', 'Icon', 'App', 'AppList', 'Parent', 'ParentList', 'Child', 'ChildrenList',
            'Change', 'ChangeList', 'Watch', 'WatchResponse', 'Thumbnail', 'Owners', 'Labels', 'Resource', 'FileList',
            'User', 'DriveFile', 'FileCapabilities', 'Picture', 'Property', 'File', 'Permission', 'PermissionInsert',
            'PermissionList', 'PermissionId', 'RevisionInsert', 'Revision', 'RevisionBase', 'User', 'RevisionList',
            'ExportFormat', 'AdditionalRoleInfo', 'About', 'UploadSize', 'ImportFormat', 'ServiceQuota', 'User', 'Feature',
            'ReplyList', 'ReplyWritable', 'CommentList', 'CommentWritable', 'Reply', 'User', 'Comment', 'Property', 'PropertyList'
            ].forEach((typeName, index) => assert.equal(documentationList[index].innerText.trim(), typeName) )
        });
      });

      describe('Security section', () => {
        it(`should be collapsed by default`, async () => {
          const securitySection = navigationSecuritySection(element);
          assert.isNull(securitySection.getAttribute('data-opened'));
        })

        it(`should be expanded if securityOpened enabled`, async () => {
          navigationTree(element).securityOpened = true;
          await aTimeout(0);

          const securitySection = navigationSecuritySection(element);
          assert.equal(securitySection.getAttribute('data-opened'), '');
        })

        it(`should list all security items`, async () => {
          const securityList = navigationSecurityList(element);
          assert.ok(securityList);
          assert.lengthOf(securityList, 1);

          assert.equal(securityList[0].innerText.trim(), 'oauth_2_0 - OAuth 2.0');
        });
      });
    });
  });
});
