import * as Yup from 'yup'

const loginUser = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        username: Yup.string().min(3).max(32).required(),
        password: Yup.string().min(8).max(25).required(),
      }),
    }
  },
}

const registerUser = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        name: Yup.string().min(3).max(32).required(),
        username: Yup.string().min(3).max(32).required(),
        password: Yup.string().min(8).max(36).required(),
        password_again: Yup.string().min(8).max(36).required(),
      }),
    }
  },
}

const getUser = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        userId: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24)
      }),
    }
  },
}

const getUserByUsername = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        username: Yup.string().required()
      }),
    }
  },
}

export { loginUser, registerUser, getUser,getUserByUsername  };