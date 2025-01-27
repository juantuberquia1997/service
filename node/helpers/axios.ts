export async function searchAxios(where: string, authToken: string, account: string) {
    const axios = require('axios');
    const fields = ['document', 'documentType', 'firstName', 'lastName', 'phone', 'phoneHome', 'isEmployee', 'xMembershipType', 'stateRegistration', 'id', 'gender', 'userId', 'Membership', 'benefitsRedemmed', 'createdIn', 'extraGuarantee', 'email', 'isAdviser', 'isTechnical'];
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: `http://${account}.myvtex.com/api/dataentities/CL/search?_fields=${fields}&_where=${where}`,
        headers: {
            'Accept': 'application/json',
            'VtexIdclientAutCookie': authToken
        },
        data: ''
    };

    try {
        const response = await axios.request(config);
        return response.data;
    } catch (error) {
        console.error('Error al hacer la solicitud de axios:', error);
        throw error;
    }
}
