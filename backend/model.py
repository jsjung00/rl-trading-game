from stable_baselines3 import PPO
#model = PPO.load(f'{log_dir}ppo_trading')
def predict(observation):
    return model.predict(observation)
    

