// Module with all graphql queries and mutations:

import gql from 'graphql-tag';

import {
    masterClient,
    generateClient,
} from './client';

export const queries = {
    me: () => {
        const query = gql`
            {
                viewer {
                    details {
                        username
                        email
                    }
                }
            }
        `;

        return masterClient.query({query});
    },

    templates: () => {
        const query = gql`
            {
                viewer {
                    templates {
                        edges {
                            node {
                                id
                                title
                            }
                        }
                    }
                }
            }
        `;

        return masterClient.query({query})
    },

    workflows: (token) => {
        const query = gql`
            {
                viewer {
                    workflows {
                        edges {
                            node {
                                name
                            }
                        }
                    }
                }
            }
        `;

        return generateClient(token).query({query});
    },

    trayUsername: uuid => {
        const query = gql`
            {
                users(criteria: {externalUserId: "${uuid}"}) {
                    edges {
                        node {
                            id
                        }
                    }
                }
            }
        `
        return masterClient.query({query});
    }
};

export const mutations = {
    authorize: (userId) => {
        const mutation = gql`
            mutation {
                authorize(input: {userId: `${userId}`}) {
                    accessToken
                }
            }
        `;

        return masterClient.mutate({mutation});
    },

    createWorkflowFromTemplate: (userToken, templateId) => {
        const mutation = gql`
            mutation {
                createWorkflowFromTemplate(input: {templateId: `${templateId}`}) {
                    workflowId
                }
            }
        `;

        const userClient = generateClient(userToken);

        return userClient.mutate({mutation});
    },

    createExternalUser: (id, name) => {
        const mutation = gql`
            mutation {
                createExternalUser(input : {externalUserId: "${id}", name: "${name}"}) {
                    userId
                }
            }
        `;

        return masterClient.mutate({mutation})
    },

    getGrantTokenForUser: (uuid, workflowId) => {
        const mutation = gql`
            mutation {
                generateAuthorizationCode(input: {userId: `${userId}`}) {
                    authorizationCode
                }
            }
        `;

        return masterClient.mutate({mutation})
            .then(payload => {
                return {
                    uuid,
                    payload,
                    workflowId,
                };
            });
    },
}