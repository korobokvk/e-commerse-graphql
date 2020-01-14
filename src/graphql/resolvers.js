import { gql } from 'apollo-boost'
import { addItemToCart, getCartItemCount, getCartTotal, removeItemFromCart, clearItemFromCart } from './cart.utils'

const cartMutationUpdateUtil = (newValue, cache) => {
  cache.writeQuery({
    query: GET_ITEM_COUNT,
    data: { itemCount: getCartItemCount(newValue) },
  })

  cache.writeQuery({
    query: GET_CART_TOTAL,
    data: { cartTotal: getCartTotal(newValue) },
  })

  cache.writeQuery({
    query: GET_CART_ITEMS,
    data: { cartItems: newValue },
  })
}
export const typeDefs = gql`
  extend type Item {
    quantity: Int
  }
  extend type Mutation {
    ToggleCartHidden: Boolean!
    AddItemToCart(item: Item!): [Item]
    RemoveItemFromCart(item: Item!): [Item]
    ClearItemFromCart(item: Item!): [Item]
  }
`

const GET_CART_HIDDEN = gql`
  {
    cartHidden @client
  }
`
const GET_CART_ITEMS = gql`
  {
    cartItems @client
  }
`
const GET_ITEM_COUNT = gql`
  {
    itemCount @client
  }
`

const GET_CART_TOTAL = gql`
  {
    cartTotal @client
  }
`

export const resolvers = {
  Mutation: {
    toggleCartHidden: (_root, _args, { cache }) => {
      const { cartHidden } = cache.readQuery({
        query: GET_CART_HIDDEN,
      })

      cache.writeQuery({
        query: GET_CART_HIDDEN,
        data: { cartHidden: !cartHidden },
      })

      return !cartHidden
    },

    addItemToCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS,
      })
      const newCartItems = addItemToCart(cartItems, item)

      cartMutationUpdateUtil(newCartItems, cache)

      return newCartItems
    },
    removeItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS,
      })

      const newCartItems = removeItemFromCart(cartItems, item)

      cartMutationUpdateUtil(newCartItems, cache)

      return newCartItems
    },
    clearItemFromCart: (_root, { item }, { cache }) => {
      const { cartItems } = cache.readQuery({
        query: GET_CART_ITEMS,
      })

      const newCartItems = clearItemFromCart(cartItems, item)

      cartMutationUpdateUtil(newCartItems, cache)

      return newCartItems
    },
  },
}
