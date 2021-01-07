import React, { useCallback, useRef } from 'react';
import { FiMail, FiUser, FiLock, FiArrowLeft } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { Form } from '@unform/web'
import { Link, useHistory } from 'react-router-dom'
import * as Yup from 'yup'; //importando tudo de dentro do yup
import { Container, Content, Background, AnimationContainer } from './styles'
import Button from '../../components/Button/index'
import Input from '../../components/input/index'

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}



const SignUp: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();
  const handleSubmit = useCallback(async (data: SignUpFormData) => {
    try {
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        name: Yup.string().required('Nome é obrigatório.'),
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
        password: Yup.string().min(6, 'No minimo 6 digitos')
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });
      await api.post('/users', data);
      history.push('/');
      addToast({
        type: 'sucess',
        title: 'Cadastro realizado',
        description: 'Você já pode fazer seu logon no GoBarber!',
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro no cadastro',
        description: 'Ocorreu um erro ao fazer cadastro, tente novamente',
      });
    }
  }, [addToast, history]);
  return (
    <Container>
      <Background />

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome"></Input>
            <Input name="email" icon={FiMail} placeholder="Email"></Input>
            <Input name="password" icon={FiLock} type="password" placeholder="Senha"></Input>
            <Button type="submit">Cadastrar</Button>

          </Form>

          <Link to="/">
            <FiArrowLeft />
            Voltar para o logon
       </Link>
        </AnimationContainer>
      </Content>



    </Container>
  )
}

export default SignUp;
