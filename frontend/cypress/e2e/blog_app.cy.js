describe('Blog app', () => {
  beforeEach(() => {
    cy.request('POST', 'http://localhost:3003/reset')
    cy.createUser({ name: 'Matti Luukkainen', username: 'mluukkai', password: 'salainen' })
    cy.visit('')
  })

  it('Login form is shown', () => {
    cy.contains('Log in to application')
  })

  describe('Login', () => {
    it('succeeds with correct credentials', () => {
      cy.get('#username-input').type('mluukkai')
      cy.get('#password-input').type('salainen')
      cy.get('#login-submit').click()
      cy.contains('Logged in mluukkai')
    })

    it('fails with wrong credentials', () => {
      cy.get('#username-input').type('m')
      cy.get('#password-input').type('salainen')
      cy.get('#login-submit').click()
      cy.contains('Wrong credentials')
    })

    it('shows error text in red on invalid login', () => {
      cy.get('#username-input').type('m')
      cy.get('#password-input').type('salainen')
      cy.get('#login-submit').click()
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe('When logged in', () => {
    beforeEach(() => {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', () => {
      cy.writeBlog({
        title: 'Test Blog Title',
        author: 'Test Author',
        url: 'http://www.testing.com/test-blog'
      })
      cy.contains('Test Blog Title')
      cy.contains('Added your blog: Test Blog Title!')
    })

    describe('and a blog exists', () => {
      beforeEach(() => {
        cy.writeBlog({
          title: 'Test Blog Two',
          author: 'Test Author Two',
          url: 'http://www.testing/test-two'
        })
      })

      it('it can be liked', () => {
        cy.contains('0 likes')
        cy.contains('View').click()
        cy.get('.like-btn').click()
        cy.wait(1000)
        cy.contains('1 likes')
      })

      it('the creating user can delete it', () => {
        cy.contains('Test Blog Two by Test Author Two')
        cy.contains('View').click()
        cy.contains('Remove').click()
        cy.on('window:confirm', () => true)
        cy.wait(1000)
        cy.get('.blogs-container').should('not.contain', 'Test Blog Two')
      })

      it('any other user cannot see delete button', () => {
        cy.createUser({ name: 'Not Authorized', username: 'notOk', password: 'password' })
        cy.login({ username: 'notOk', password: 'password' })
        cy.contains('View').click()
        cy.get('.delete-blog').should('not.exist')
      })
    })

    describe('When there are multiple blogs', () => {
      beforeEach(() => {
        cy.writeBlog({ title: 'Blog With One', author: 'Author1', url: 'http://www.1-like.com' })
        cy.writeBlog({ title: 'Blog With Two', author: 'Author2', url: 'http://www.2-likes.com' })
        cy.writeBlog({ title: 'Blog With Three', author: 'Author3', url: 'http://www.3-likes.com' })
        cy.writeBlog({ title: 'Blog With Four', author: 'Author4', url: 'http://www.4-likes.com' })
      })

      it('they are sorted by likes, high to low', () => {
        cy.contains('One').parent().parent().as('first')
        cy.contains('Two').parent().parent().as('second')
        cy.contains('Three').parent().parent().as('third')
        cy.contains('Four').parent().parent().as('fourth')

        // Initially in order 1, 2, 3, 4
        cy.get('.single-blog').eq(0).should('contain', 'One')
        cy.get('.single-blog').eq(1).should('contain', 'Two')
        cy.get('.single-blog').eq(2).should('contain', 'Three')
        cy.get('.single-blog').eq(3).should('contain', 'Four')

        cy.get('@first').contains('View').click()
        cy.get('@first').contains('Like').as('one')
        cy.get('@second').contains('View').click()
        cy.get('@second').contains('Like').as('two')
        cy.get('@third').contains('View').click()
        cy.get('@third').contains('Like').as('three')
        cy.get('@fourth').contains('View').click()
        cy.get('@fourth').contains('Like').as('four')

        cy.get('@one').click()
        cy.wait(100)
        cy.get('@two').click()
        cy.wait(100)
        cy.get('@two').click()
        cy.wait(100)
        cy.get('@three').click()
        cy.wait(100)
        cy.get('@three').click()
        cy.wait(100)
        cy.get('@three').click()
        cy.wait(100)
        cy.get('@four').click()
        cy.wait(100)
        cy.get('@four').click()
        cy.wait(100)
        cy.get('@four').click()
        cy.wait(100)
        cy.get('@four').click()
        cy.wait(100)

        // Now in order 4, 3, 2, 1
        cy.get('.single-blog').eq(0).should('contain', 'Four')
        cy.get('.single-blog').eq(1).should('contain', 'Three')
        cy.get('.single-blog').eq(2).should('contain', 'Two')
        cy.get('.single-blog').eq(3).should('contain', 'One')
      })
    })
  })
})
