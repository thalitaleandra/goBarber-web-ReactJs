import React, { useCallback, useRef } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import { Form } from '@unform/web'
import * as Yup from 'yup'; //importando tudo de dentro do yup
import { Link, useHistory } from 'react-router-dom'
import { useAuth } from '../../hooks/auth'
import { useToast } from '../../hooks/toast'
import { Container, Content, AnimationContainer, Background } from './styles'
import Button from '../../components/Button/index'
import Input from '../../components/input/index'

interface SignInFormData {
  email: string;
  password: string;
}


const SignIn: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { user, signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  console.log(user);


  const handleSubmit = useCallback(async (data: SignInFormData) => {
    try {
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
        password: Yup.string().required('Senha obrigatória.')
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });
      await signIn({
        email: data.email,
        password: data.password,
      });
      history.push('/dashboard')
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na autenticacao',
        description: 'Ocorreu um erro ao fazer login, cheque as credenciais',
      });
    }
  },
    [signIn, addToast, history]
  );
  return (
    <Container>

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <Input name="email" icon={FiMail} placeholder="Email"></Input>
            <Input name="password" icon={FiLock} type="password" placeholder="Senha"></Input>
            <Button type="submit">Entrar</Button>
            <Link to="forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar conta
       </Link>
        </AnimationContainer>
      </Content>
      <Background />


    </Container>
  )
}

export default SignIn;
