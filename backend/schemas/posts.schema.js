
import * as Yup from 'yup'

const listsPosts = {
  schema: {
    query: {
      yupSchema: Yup.object().shape({
        title: Yup.string().test('len', "Value must  be less than 100", val => (val && val.length <= 100 || true)),
        content: Yup.string().test('len', "Value must be more than 20", val => (val && val.length >= 20 || true)),
        authorName: Yup.string().test('len', "Value must be 3 chars length", val => (val && val.length >= 3 || true)),
        tags: Yup.string().test('len', "Value must be 2 chars length", val => (val && val.length >= 2 || true)), // comma seperated
        limit: Yup.number().min(1).default(10),
        page: Yup.number().min(1).default(1)
      })
    }
  }
}

const addPost = {
  schema: {
    body: {
      yupSchema: Yup.object().shape({
        title: Yup.string().max(100).required(),
        content: Yup.string().min(20).required(),
        authorId: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
        tags: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
      }),
    }
  },
}



const getPost = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        id: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
      })
    },
  },
}

const editPost = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        id: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
      })
    },
    body: {
      yupSchema: Yup.object().shape({
        title: Yup.string().max(100).required(),
        content: Yup.string().min(20).required(),
        authorId: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
        tags: Yup.lazy(val => (Array.isArray(val) ? Yup.array().of(Yup.string()) : Yup.string())),
      })
    },
  },
}


const deletePost = {
  schema: {
    query: {
      yupSchema: Yup.object().shape({
        id: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
      })
    }
  }
}

const userPosts = {
  schema: {
    params: {
      yupSchema: Yup.object().shape({
        userId: Yup.string().required().test('len', "Value must be 24 chars length", val => val && val.length == 24),
      })
    },
  },
}

export default { listsPosts, addPost, getPost, editPost, deletePost, userPosts };