import React, { useCallback, useRef, useState } from 'react';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi'
import { FormHandles } from '@unform/core';
import getValidationErrors from '../../utils/getValidationErrors'
import logoImg from '../../assets/logo.svg'
import { Form } from '@unform/web'
import * as Yup from 'yup'; //importando tudo de dentro do yup
import { Link } from 'react-router-dom'
import { useToast } from '../../hooks/toast'
import { Container, Content, AnimationContainer, Background } from './styles'
import Button from '../../components/Button/index'
import Input from '../../components/input/index'
import api from '../../services/api';

interface ForgotPasswordFormData {
  email: string;
}


const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();




  const handleSubmit = useCallback(async (data: ForgotPasswordFormData) => {
    try {
      setLoading(true);
      formRef.current ?.setErrors({});
      const schema = Yup.object().shape({
        email: Yup.string().required('E-mail é obrigatório').email('Digite um E-mail válido.'),
      });
      await schema.validate(data, {
        abortEarly: false, // aborda todos os erros de uma vez só
      });
      // recuperacao de senha
      await api.post('/password/forgot', {
        email: data.email,
      })
      addToast({
        type: 'sucess',
        title: 'E-mail de recuperação enviado',
        description:
          'Enviamos um e-mail para confirmar a recuperaao, cheque sua caixa de email'
      })
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const errors = getValidationErrors(err);
        formRef.current ?.setErrors(errors);

        return;
      }

      addToast({
        type: 'error',
        title: 'Erro na recuperação de senha',
        description: 'Ocorreu um erro ao tentar realizar a recuperação de senha, tente novamente',
      });
    } finally {
      setLoading(false);
    }
  },
    [addToast]
  );
  return (
    <Container>

      <Content>
        <AnimationContainer>
          <img src={logoImg} alt="GoBarber" />

          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Recuperar senha</h1>
            <Input name="email" icon={FiMail} placeholder="Email"></Input>
            <Button type="submit">Recuperar</Button>
          </Form>
          <Link to="/signin">
            <FiLogIn />
            Voltar ao login
       </Link>
        </AnimationContainer>
      </Content>
      <Background />


    </Container>
  )
}

export default ForgotPassword;
