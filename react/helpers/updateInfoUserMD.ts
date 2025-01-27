const updateInfoUserMD = async (
  response: any
) => {

  const ENTITY_CLIENT = "CL"
  let { profile: { city, gender, firstName, lastName, email }, data: { region, fechaNacimiento, cedula } } = response

  try {
    await fetch(`_v/${ENTITY_CLIENT}/document`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.vtex.ds.v10+json',
        'Cookie': 'janus_sid=670d3c8a-b806-43ca-a750-18d002711e1c'
      },
      body: JSON.stringify({
        dataEntity: ENTITY_CLIENT,
        document: {
          // id: IdVTEX,
          email,
          cityClient: city,
          departmentClient: region,
          birthDate: fechaNacimiento,
          gender,
          document: cedula,
          firstName,
          lastName
        }
      }),
    })


  } catch (error) {
    console.error('Error:', error);
  }
};

export default updateInfoUserMD;
